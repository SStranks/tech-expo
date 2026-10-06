#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: postgres-init.sh
# Description: initializes the postgres docker service; creates users, schemas,
#              permissions, system configuration - one-time operation
# Usage: entrypoint: ['/usr/local/bin/postgres-init.sh']
# -----------------------------------------------------------------------------

db="$(cat /run/secrets/postgres_database)"
user_super="$(cat /run/secrets/postgres_user_super)"
user_service="$(cat /run/secrets/postgres_user_service)"
user_migrator="$(cat /run/secrets/postgres_user_migrator)"
user_metrics="$(cat /run/secrets/postgres_user_metrics)"
password_service="$(cat /run/secrets/postgres_password_service)"
password_migrator="$(cat /run/secrets/postgres_password_migrator)"
password_metrics="$(cat /run/secrets/postgres_password_metrics)"

: "${db:?postgres_database is empty}"
: "${user_super:?postgres_user_super is empty}"
: "${user_service:?postgres_user_service is empty}"
: "${user_migrator:?postgres_user_migrator is empty}"
: "${user_metrics:?postgres_user_metrics is empty}"
: "${password_service:?postgres_password_service is empty}"
: "${password_migrator:?postgres_password_migrator is empty}"
: "${password_metrics:?postgres_password_metrics is empty}"

schema_metrics="metrics"

echo "*** Postgres Initialization: Start ***"

# Wait for initial database creation to complete
echo "*** Postgres Initialization: Check existence of database - prevent race condition ***"
until psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" -c '\q' 2> /dev/null; do
  echo "Waiting for database \"$db\" to be created..."
  sleep 1
done

### --------------- Create database users  --------------- ###

echo "*** Postgres Initialization: Create service user ***"
psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" <<- EOSQL
  CREATE USER $user_service WITH PASSWORD '$password_service';
EOSQL

echo "*** Postgres Initialization: Create migrator user ***"
psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" <<- EOSQL
  CREATE USER $user_migrator WITH PASSWORD '$password_migrator';
EOSQL

echo "*** Postgres Initialization: Create metrics user ***"
psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" <<- EOSQL
  CREATE USER $user_metrics WITH PASSWORD '$password_metrics';
EOSQL

### ------------------ Create schemas  ------------------- ###

echo "*** Postgres Initialization: Create drizzle schema ***"
psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" <<- EOSQL
  CREATE SCHEMA IF NOT EXISTS drizzle AUTHORIZATION $user_migrator;
EOSQL

echo "*** Postgres Initialization: Create metrics schema ***"
psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" <<- EOSQL
  CREATE SCHEMA IF NOT EXISTS $schema_metrics AUTHORIZATION $user_metrics;
EOSQL

### --------------- Create user permissions  --------------- ###

echo "*** Postgres Initialization: Amend service user permissions ***"
psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" <<- EOSQL
  GRANT CONNECT ON DATABASE "$db" TO $user_service;
  GRANT USAGE ON SCHEMA public TO $user_service;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $user_service;
  GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO $user_service;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO $user_service;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $user_service;
EOSQL

echo "*** Postgres Initialization: Amend migrator user permissions ***"
psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" <<- EOSQL
  GRANT ALL PRIVILEGES ON DATABASE "$db" TO $user_migrator;
  GRANT USAGE, CREATE ON SCHEMA drizzle TO $user_migrator;
  GRANT USAGE, CREATE ON SCHEMA public TO $user_migrator;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $user_migrator;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $user_migrator;
  GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $user_migrator;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $user_migrator;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $user_migrator;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $user_migrator;
EOSQL

echo "*** Postgres Initialization: Amend metrics user permissions ***"
psql -v ON_ERROR_STOP=1 --username="$user_super" --dbname="$db" <<- EOSQL
  GRANT CONNECT ON DATABASE postgres TO $user_metrics;
  GRANT $user_metrics TO $user_super;
  GRANT pg_monitor to $user_metrics;
  ALTER USER $user_metrics SET SEARCH_PATH TO $schema_metrics,pg_catalog;
EOSQL

echo "*** Postgres Initialization: Allow future privileges for $user_service ***"
psql -v ON_ERROR_STOP=1 --username="$user_migrator" --dbname="$db" <<- EOSQL
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $user_service;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO $user_service;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO $user_service;
EOSQL

### ----------------- System Configuration  ---------------- ###

echo "*** Postgres Initialization: Set SSL/TLS Configuration ***"
psql -U dev1 --db="postgres" <<- EOSQL
ALTER SYSTEM SET ssl = 'on';
ALTER SYSTEM SET ssl_cert_file = '/etc/postgres/certs/postgres.crt';
ALTER SYSTEM SET ssl_key_file  = '/etc/postgres/certs/postgres.key';
ALTER SYSTEM SET ssl_ca_file   = '/etc/postgres/certs/postgres-ca.crt';
SELECT pg_reload_conf();
EOSQL

echo "*** Postgres Initialization: Complete ***"
