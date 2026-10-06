#!/usr/bin/env bash

# Script to generate a new user on a new mongodb instance

# -----------------------------------------------------------------------------
# Script: mongo-user-init.sh
# Description: initializes a single user with 'readWrite' permissions on a
#              mongo instance.
# -----------------------------------------------------------------------------

: "${MONGO_INITDB_ROOT_USERNAME:?MONGO_INITDB_ROOT_USERNAME variable is required}"
: "${MONGO_INITDB_ROOT_PASSWORD:?MONGO_INITDB_ROOT_PASSWORD variable is required}"
: "${MONGO_USER:?MONGO_USER variable is required}"
: "${MONGO_PASSWORD:?MONGO_PASSWORD variable is required}"
: "${MONGO_DATABASE:?MONGO_USER DATABASEiable is required}"

echo "*** Preparing MongoDB User Configuration ***"
sleep 3
echo "*** Initializing MongoDB User Configuration ***"
mongosh --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" << EOF
use admin
db.createUser({ user: $MONGO_USER, pwd: $MONGO_PASSWORD, roles: [{ role: 'readWrite', db: $MONGO_DATABASE }] })
quit()
EOF

echo "*** Completed MongoDB User Configuration ***"
exit 0
