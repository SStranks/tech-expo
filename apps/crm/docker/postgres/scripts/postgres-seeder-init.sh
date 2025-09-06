#!/usr/bin/env sh
set -eu

POSTGRES_USER="$(cat /run/secrets/postgres_user_migrator)"
POSTGRES_PASSWORD="$(cat /run/secrets/postgres_password_migrator)"
POSTGRES_DATABASE="$(cat /run/secrets/postgres_database)"
POSTGRES_PEPPER="$(cat /run/secrets/postgres_pepper)"
DEMO_ACC_GENERIC_NON_USER_PASSWORD="$(cat /run/secrets/demo_acc_generic_non_user_password)"

: "${POSTGRES_USER:?postgres_user_migrator is empty}"
: "${POSTGRES_PASSWORD:?postgres_password_migrator is empty}"
: "${POSTGRES_DATABASE:?postgres_database is empty}"
: "${POSTGRES_PEPPER:?postgres_pepper is empty}"
: "${DEMO_ACC_GENERIC_NON_USER_PASSWORD:?demo_acc_generic_non_user_password is empty}"

export POSTGRES_USER
export POSTGRES_PASSWORD
export POSTGRES_DATABASE
export POSTGRES_PEPPER
export DEMO_ACC_GENERIC_NON_USER_PASSWORD

echo "Postgres-Seeder Init Complete: Starting interactive shell.."
exec sh
