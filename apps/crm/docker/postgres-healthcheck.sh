#!/bin/bash
set -euo pipefail

HOST="${POSTGRES_HOST:-localhost}"
PORT="${POSTGRES_DOCKER_PORT:-5432}"
DB="${POSTGRES_DB:-postgres}"
USER="$(cat /run/secrets/postgres_user)"

pg_isready -h "$HOST" -p "$PORT" -d "$DB" -U "$USER" > /dev/null
