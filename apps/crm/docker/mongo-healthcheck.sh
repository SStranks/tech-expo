#!/usr/bin/env bash
set -euo pipefail

HOST="localhost:${MONGO_DOCKER_PORT:-27017}"
DB="$(cat /run/secrets/mongo_database)"
USER="$(cat /run/secrets/mongo_root_user)"
PASS="$(cat /run/secrets/mongo_root_password)"

mongosh "$HOST/$DB" \
  --username "$USER" \
  --password "$PASS" \
  --authenticationDatabase admin \
  --quiet \
  --eval 'db.runCommand({ ping: 1 }).ok' | grep 1 > /dev/null
