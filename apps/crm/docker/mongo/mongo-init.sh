#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: mongo-init.sh
# Description: initializes the mongo docker service; bound to
#              docker-entrypoint-initdb.d; runs once on new container+volume.
#              Creates: service and metrics users, dummy init database
# Usage: entrypoint: ['/usr/local/bin/mongo-init.sh']
# -----------------------------------------------------------------------------

# Mongo docker image only supports secrets for MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD
DB="$(cat /run/secrets/mongo_database)"
USER_SERVICE="$(cat /run/secrets/mongo_user_service)"
PASSWORD_SERVICE="$(cat /run/secrets/mongo_password_service)"
USER_METRICS="$(cat /run/secrets/mongo_user_metrics)"
PASSWORD_METRICS="$(cat /run/secrets/mongo_password_metrics)"

: "${DB:?mongo_database is empty}"
: "${USER_SERVICE:?mongo_user_service is empty}"
: "${PASSWORD_SERVICE:?mongo_password_service is empty}"
: "${USER_METRICS:?mongo_user_metrics is empty}"
: "${PASSWORD_METRICS:?mongo_password_metrics is empty}"

echo "*** Preparing MongoDB User Configuration ***"
sleep 1
echo "*** Initializing MongoDB User Configuration ***"
mongosh --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" << EOF
use admin
db.createUser({ user: "$USER_SERVICE", pwd: "$PASSWORD_SERVICE", roles: [{ role: 'readWrite', db: "$DB" }] })
db.createUser({ user: "$USER_METRICS", pwd: "$PASSWORD_METRICS", roles: [{ role: 'clusterAdmin', db: 'admin' }, { role: 'clusterMonitor', db: 'admin' }, { role: 'read', db: 'local' }] })
quit()
EOF
echo "*** Completed MongoDB User Configuration ***"

# Add dummy collection to initialize database
echo "*** Preparing MongoDB Database Configuration ***"
mongosh --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" << EOF
use $DB
db.createCollection("init_collection")
db.init_collection.insertOne({ initialized: true })
EOF
echo "*** Completed MongoDB Database Configuration ***"
