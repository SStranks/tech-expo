#!/bin/bash

# mongo-init.sh - bound to docker-entrypoint-initdb.d; runs only once on fresh container and fresh volume

# Script to generate a new user on a new mongodb instance

echo "*** Preparing MongoDB User Configuration ***"
sleep 3
echo "*** Initializing MongoDB User Configuration ***"
mongosh --username $MONGODB_INITDB_ROOT_USERNAME --password $MONGODB_INITDB_ROOT_PASSWORD << EOF
use admin
db.createUser({ user: $MONGODB_USER, pwd: $MONGODB_PASSWORD, roles: [{ role: 'readWrite', db: $MONGODB_DATABASE }] })
quit()
EOF

echo "*** Completed MongoDB User Configuration ***"
exit 0