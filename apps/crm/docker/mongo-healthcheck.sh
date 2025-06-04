#!/bin/bash
set -euo pipefail

HOST="localhost:${MONGODB_DOCKER_PORT:-27017}"
DB="${MONGODB_DATABASE:-admin}"
USER="$(cat /run/secrets/mongodb_root_user)"
PASS="$(cat /run/secrets/mongodb_root_password)"

mongosh "$HOST/$DB" \
  --username "$USER" \
  --password "$PASS" \
  --authenticationDatabase admin \
  --quiet \
  --eval 'db.runCommand({ ping: 1 }).ok' | grep 1 > /dev/null
