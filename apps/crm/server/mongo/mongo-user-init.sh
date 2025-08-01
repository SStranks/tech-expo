#!/usr/bin/env bash

# Script to generate a new user on a new mongodb instance

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
