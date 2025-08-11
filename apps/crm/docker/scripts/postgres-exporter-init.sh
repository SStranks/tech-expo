#!/usr/bin/env sh
set -euo

: "${POSTGRES_CONTAINER:?Environment variable POSTGRES_CONTAINER is required but not set.}"
: "${POSTGRES_DOCKER_PORT:?Environment variable POSTGRES_DOCKER_PORT is required but not set.}"

DB="$(cat /run/secrets/postgres_database)"
USER_SERVICE="$(cat /run/secrets/postgres_user_service)"
PASSWORD_SERVICE="$(cat /run/secrets/postgres_password_service)"
DATA_SOURCE_NAME="postgres://${USER_SERVICE}:${PASSWORD_SERVICE}@${POSTGRES_CONTAINER}:${POSTGRES_DOCKER_PORT}/${DB}?sslmode=disable"

export DATA_SOURCE_NAME

exec /bin/postgres_exporter "$@"
