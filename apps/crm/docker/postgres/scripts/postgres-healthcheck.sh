#!/usr/bin/env bash
set -euo pipefail

DB="$(cat /run/secrets/postgres_database)"
USER_SUPER="$(cat /run/secrets/postgres_user_super)"

: "${DB:?postgres_database is empty}"
: "${USER_SUPER:?postgres_user_super is empty}"

# NOTE: exclude -h otherwise it is treated as TCP rather than Unix socket;
# NOTE: Unix is caught by pg_hba.conf "local" settings
pg_isready -d "$DB" -U "$USER_SUPER" > /dev/null
