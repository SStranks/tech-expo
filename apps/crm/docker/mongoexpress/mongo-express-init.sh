#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: mongo-express-init.sh
# Description: initializes the mongo-express docker service
# Usage: entrypoint: ['/usr/local/bin/mongo-express-init.sh']
# -----------------------------------------------------------------------------

# NOTE: Secure way of interpolation of secrets; v.1.0.3 will have URL_FILE available instead

DB="$(cat /run/secrets/mongo_database)"
USER_ROOT="$(cat /run/secrets/mongo_user_root)"
PASSWORD_ROOT="$(cat /run/secrets/mongo_password_root)"

: "${DB:?mongo_database is empty}"
: "${USER_ROOT:?mongo_user_root is empty}"
: "${PASSWORD_ROOT:?mongo_password_root is empty}"

export ME_CONFIG_MONGODB_URL="${MONGO_PROTOCOL}://${USER_ROOT}:${PASSWORD_ROOT}@${MONGO_CONTAINER}:${MONGO_PORT}/${DB}${MONGO_ARGS}"

exec node app
