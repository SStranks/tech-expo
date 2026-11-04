#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: postgres-seeder-init.sh
# Description: initializes the postgres-seeder docker service
# Usage: entrypoint: ['/usr/local/bin/postgres-seeder-init.sh']
# -----------------------------------------------------------------------------

POSTGRES_USER="$(cat /run/secrets/postgres_user_migrator)"
POSTGRES_PASSWORD="$(cat /run/secrets/postgres_password_migrator)"
POSTGRES_DATABASE="$(cat /run/secrets/postgres_database)"
POSTGRES_PEPPER="$(cat /run/secrets/postgres_pepper)"
DEMO_ACCOUNT_GENERIC_NON_USER_PASSWORD="$(cat /run/secrets/demo_account_generic_non_user_password)"
DEMO_ACCOUNT_USER_PASSWORD="$(cat /run/secrets/demo_account_user_password)"
DEMO_ACCOUNT_MODERATOR_PASSWORD="$(cat /run/secrets/demo_account_moderator_password)"
DEMO_ACCOUNT_ADMIN_PASSWORD="$(cat /run/secrets/demo_account_admin_password)"

: "${POSTGRES_USER:?postgres_user_migrator is empty}"
: "${POSTGRES_PASSWORD:?postgres_password_migrator is empty}"
: "${POSTGRES_DATABASE:?postgres_database is empty}"
: "${POSTGRES_PEPPER:?postgres_pepper is empty}"
: "${DEMO_ACCOUNT_GENERIC_NON_USER_PASSWORD:?demo_account_generic_non_user_password is empty}"
: "${DEMO_ACCOUNT_USER_PASSWORD:?demo_account_user_password is empty}"
: "${DEMO_ACCOUNT_MODERATOR_PASSWORD:?demo_account_moderator_password is empty}"
: "${DEMO_ACCOUNT_ADMIN_PASSWORD:?demo_account_admin_password is empty}"

export POSTGRES_USER
export POSTGRES_PASSWORD
export POSTGRES_DATABASE
export POSTGRES_PEPPER
export DEMO_ACCOUNT_GENERIC_NON_USER_PASSWORD
export DEMO_ACCOUNT_USER_PASSWORD
export DEMO_ACCOUNT_MODERATOR_PASSWORD
export DEMO_ACCOUNT_ADMIN_PASSWORD

echo "Postgres-Seeder Init Complete: Starting interactive shell.."
exec sh
