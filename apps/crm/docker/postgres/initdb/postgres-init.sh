#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: postgres-init.sh
# Description: initializes the postgres docker service; creates users, schemas,
#              permissions, system configuration - one-time operation
# Usage: entrypoint: ['/usr/local/bin/postgres-init.sh']
# -----------------------------------------------------------------------------

DB="$(cat /run/secrets/postgres_database)"
USER_SUPER="$(cat /run/secrets/postgres_user_super)"
USER_SERVICE="$(cat /run/secrets/postgres_user_service)"
USER_MIGRATOR="$(cat /run/secrets/postgres_user_migrator)"
USER_METRICS="$(cat /run/secrets/postgres_user_metrics)"
PASSWORD_SERVICE="$(cat /run/secrets/postgres_password_service)"
PASSWORD_MIGRATOR="$(cat /run/secrets/postgres_password_migrator)"
PASSWORD_METRICS="$(cat /run/secrets/postgres_password_metrics)"

: "${DB:?postgres_database is empty}"
: "${USER_SUPER:?postgres_user_super is empty}"
: "${USER_SERVICE:?postgres_user_service is empty}"
: "${USER_MIGRATOR:?postgres_user_migrator is empty}"
: "${USER_METRICS:?postgres_user_metrics is empty}"
: "${PASSWORD_SERVICE:?postgres_password_service is empty}"
: "${PASSWORD_MIGRATOR:?postgres_password_migrator is empty}"
: "${PASSWORD_METRICS:?postgres_password_metrics is empty}"

SCHEMA_METRICS="metrics"

echo "*** Postgres Initialization: Start ***"

# Wait for initial database creation to complete
echo "*** Postgres Initialization: Check existence of database - prevent race condition ***"
until psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" -c '\q' 2> /dev/null; do
  echo "Waiting for database \"$DB\" to be created..."
  sleep 1
done

### --------------- Create database users  --------------- ###

echo "*** Postgres Initialization: Create service user ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  CREATE USER $USER_SERVICE WITH PASSWORD '$PASSWORD_SERVICE';
EOSQL

echo "*** Postgres Initialization: Create migrator user ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  CREATE USER $USER_MIGRATOR WITH PASSWORD '$PASSWORD_MIGRATOR';
EOSQL

echo "*** Postgres Initialization: Create metrics user ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  CREATE USER $USER_METRICS WITH PASSWORD '$PASSWORD_METRICS';
EOSQL

### ------------------ Create schemas  ------------------- ###

echo "*** Postgres Initialization: Create drizzle schema ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  CREATE SCHEMA IF NOT EXISTS drizzle AUTHORIZATION $USER_MIGRATOR;
EOSQL

echo "*** Postgres Initialization: Create metrics schema ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  CREATE SCHEMA IF NOT EXISTS $SCHEMA_METRICS AUTHORIZATION $USER_METRICS;
EOSQL

### --------------- Create user permissions  --------------- ###

echo "*** Postgres Initialization: Amend service user permissions ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  GRANT CONNECT ON DATABASE "$DB" TO $USER_SERVICE;
  GRANT USAGE ON SCHEMA public TO $USER_SERVICE;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $USER_SERVICE;
  GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO $USER_SERVICE;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO $USER_SERVICE;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $USER_SERVICE;
EOSQL

echo "*** Postgres Initialization: Amend migrator user permissions ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  GRANT ALL PRIVILEGES ON DATABASE "$DB" TO $USER_MIGRATOR;
  GRANT USAGE, CREATE ON SCHEMA drizzle TO $USER_MIGRATOR;
  GRANT USAGE, CREATE ON SCHEMA public TO $USER_MIGRATOR;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $USER_MIGRATOR;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $USER_MIGRATOR;
  GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $USER_MIGRATOR;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $USER_MIGRATOR;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $USER_MIGRATOR;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $USER_MIGRATOR;
EOSQL

echo "*** Postgres Initialization: Amend metrics user permissions ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  GRANT CONNECT ON DATABASE postgres TO $USER_METRICS;
  GRANT $USER_METRICS TO $USER_SUPER;
  GRANT pg_monitor to $USER_METRICS;
  ALTER USER $USER_METRICS SET SEARCH_PATH TO $SCHEMA_METRICS,pg_catalog;
EOSQL

echo "*** Postgres Initialization: Allow future privileges for $USER_SERVICE ***"
psql -v ON_ERROR_STOP=1 --username="$USER_MIGRATOR" --dbname="$DB" <<- EOSQL
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $USER_SERVICE;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO $USER_SERVICE;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO $USER_SERVICE;
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
