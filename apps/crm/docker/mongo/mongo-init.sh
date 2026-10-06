#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: mongo-init.sh
# Description: initializes the mongo docker service; bound to
#              docker-entrypoint-initdb.d; runs once on new container+volume.
#              Creates: service and metrics users, dummy init database
# Usage: entrypoint: ['/usr/local/bin/mongo-init.sh']
# -----------------------------------------------------------------------------

: "${MONGO_INITDB_ROOT_USERNAME:?MONGO_INITDB_ROOT_USERNAME variable is required}"
: "${MONGO_INITDB_ROOT_PASSWORD:?MONGO_INITDB_ROOT_PASSWORD variable is required}"

# Mongo docker image only supports secrets for MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD
db="$(cat /run/secrets/mongo_database)"
user_service="$(cat /run/secrets/mongo_user_service)"
password_service="$(cat /run/secrets/mongo_password_service)"
user_metrics="$(cat /run/secrets/mongo_user_metrics)"
password_metrics="$(cat /run/secrets/mongo_password_metrics)"

: "${db:?mongo_database is empty}"
: "${user_service:?mongo_user_service is empty}"
: "${password_service:?mongo_password_service is empty}"
: "${user_metrics:?mongo_user_metrics is empty}"
: "${password_metrics:?mongo_password_metrics is empty}"

echo "*** Preparing MongoDB User Configuration ***"
sleep 1
echo "*** Initializing MongoDB User Configuration ***"
mongosh --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" << EOF
use admin
db.createUser({ user: "$user_service", pwd: "$password_service", roles: [{ role: 'readWrite', db: "$db" }] })
db.createUser({ user: "$user_metrics", pwd: "$password_metrics", roles: [{ role: 'clusterAdmin', db: 'admin' }, { role: 'clusterMonitor', db: 'admin' }, { role: 'read', db: 'local' }] })
quit()
EOF
echo "*** Completed MongoDB User Configuration ***"

# Add dummy collection to initialize database
echo "*** Preparing MongoDB Database Configuration ***"
mongosh --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" << EOF
use $db
db.createCollection("init_collection")
db.init_collection.insertOne({ initialized: true })
EOF
echo "*** Completed MongoDB Database Configuration ***"
