#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: mongo-express-init.sh
# Description: initializes the mongo-express docker service
# Usage: entrypoint: ['/usr/local/bin/mongo-express-init.sh']
# -----------------------------------------------------------------------------

# NOTE: Secure way of interpolation of secrets; v.1.0.3 will have URL_FILE available instead

: "${MONGO_PROTOCOL:?MONGO_PROTOCOL variable is required}"
: "${MONGO_CONTAINER:?MONGO_CONTAINER variable is required}"
: "${MONGO_PORT:?MONGO_PORT variable is required}"

db="$(cat /run/secrets/mongo_database)"
user_root="$(cat /run/secrets/mongo_user_root)"
password_root="$(cat /run/secrets/mongo_password_root)"

: "${db:?mongo_database is empty}"
: "${user_root:?mongo_user_root is empty}"
: "${password_root:?mongo_password_root is empty}"

export ME_CONFIG_MONGODB_URL="${MONGO_PROTOCOL}://${user_root}:${password_root}@${MONGO_CONTAINER}:${MONGO_PORT}/${db}${MONGO_ARGS}"

exec node app
