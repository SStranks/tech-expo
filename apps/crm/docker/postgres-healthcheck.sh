#!/usr/bin/env bash
set -euo pipefail

HOST="${POSTGRES_HOST:-localhost}"
PORT="${POSTGRES_DOCKER_PORT:-5432}"
DB="$(cat /run/secrets/postgres_database)"
USER_SUPER="$(cat /run/secrets/postgres_user_super)"

pg_isready -h "$HOST" -p "$PORT" -d "$DB" -U "$USER_SUPER" > /dev/null
