#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: postgres-healthcheck.sh
# Description: polls the healthcheck endpoint of a postgres docker service
# Usage: test: ['CMD', '/bin/bash', '/usr/local/bin/scripts/postgres-healthcheck.sh']
# -----------------------------------------------------------------------------

db="$(cat /run/secrets/postgres_database)"
user_super="$(cat /run/secrets/postgres_user_super)"

: "${db:?postgres_database is empty}"
: "${user_super:?postgres_user_super is empty}"

# NOTE: exclude -h otherwise it is treated as TCP rather than Unix socket;
# NOTE: Unix is caught by pg_hba.conf "local" settings - no auth required
pg_isready -d "$db" -U "$user_super" > /dev/null
