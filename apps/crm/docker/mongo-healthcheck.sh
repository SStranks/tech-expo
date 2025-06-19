#!/usr/bin/env bash
set -euo pipefail

HOST="localhost:${MONGO_DOCKER_PORT:-27017}"
DB="$(cat /run/secrets/mongo_database)"
USER_ROOT="$(cat /run/secrets/mongo_user_root)"
PASSWORD_ROOT="$(cat /run/secrets/mongo_password_root)"

mongosh "$HOST/$DB" \
  --username "$USER_ROOT" \
  --password "$PASSWORD_ROOT" \
  --authenticationDatabase admin \
  --quiet \
  --eval 'db.runCommand({ ping: 1 }).ok' | grep 1 > /dev/null
