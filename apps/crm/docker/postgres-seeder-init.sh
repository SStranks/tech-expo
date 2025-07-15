#!/usr/bin/env sh
set -euo pipefail
trap 'echo "postgres-seeder-init failed at line $LINENO" >&2' ERR

POSTGRES_USER=$(cat /run/secrets/postgres_user_migrator)
POSTGRES_PASSWORD=$(cat /run/secrets/postgres_password_migrator)
POSTGRES_DATABASE=$(cat /run/secrets/postgres_database)
POSTGRES_PEPPER=$(cat /run/secrets/postgres_pepper)
DEMO_ACC_GENERIC_NON_USER_PASSWORD=$(cat /run/secrets/demo_acc_generic_non_user_password)

export POSTGRES_USER
export POSTGRES_PASSWORD
export POSTGRES_DATABASE
export POSTGRES_PEPPER
export DEMO_ACC_GENERIC_NON_USER_PASSWORD

# echo "Running postgres seeding..." >&2
echo "Postgres-Seeder Init Complete: Starting interactive shell.."
exec sh
