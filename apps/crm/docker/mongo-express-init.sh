#!/usr/bin/env bash
set -euo pipefail

MONGO_USER=$(cat /run/secrets/mongo_user)
MONGO_PASSWORD=$(cat /run/secrets/mongo_password)
MONGO_DATABASE=$(cat /run/secrets/mongo_database)

export ME_CONFIG_MONGODB_URL="${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CONTAINER}:${MONGO_PORT}/${MONGO_DATABASE}${MONGO_ARGS}"

exec node app