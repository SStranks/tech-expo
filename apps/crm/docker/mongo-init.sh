#!/usr/bin/env bash
set -euo pipefail

# mongo-init.sh - bound to docker-entrypoint-initdb.d; runs only once on fresh container and fresh volume
# Script to generate a new user on a new mongodb instance

# Mongo docker image only supports secrets for MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD
DB="$(cat /run/secrets/mongo_database)"
USER_SERVICE="$(cat /run/secrets/mongo_user_service)"
PASSWORD_SERVICE="$(cat /run/secrets/mongo_password_service)"

echo "*** Preparing MongoDB User Configuration ***"
sleep 3
echo "*** Initializing MongoDB User Configuration ***"
mongosh --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD << EOF
use admin
db.createUser({ user: "$USER_SERVICE", pwd: "$PASSWORD_SERVICE", roles: [{ role: 'readWrite', db: "$DB" }] })
quit()
EOF
echo "*** Completed MongoDB User Configuration ***"

# Add dummy collection to initialize database
echo "*** Preparing MongoDB Database Configuration ***"
mongosh --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD << EOF
use $DB
db.createCollection("init_collection")
db.init_collection.insertOne({ initialized: true })
EOF
echo "*** Completed MongoDB Database Configuration ***"