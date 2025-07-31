#!/usr/bin/env bash
set -euo pipefail

DB="$(cat /run/secrets/postgres_database)"
USER_SUPER="$(cat /run/secrets/postgres_user_super)"
USER_SERVICE="$(cat /run/secrets/postgres_user_service)"
USER_MIGRATOR="$(cat /run/secrets/postgres_user_migrator)"
PASSWORD_SERVICE="$(cat /run/secrets/postgres_password_service)"
PASSWORD_MIGRATOR="$(cat /run/secrets/postgres_password_migrator)"

echo "*** Postgres Initialization: Start ***"

# Wait for initial database creation to complete
echo "*** Postgres Initialization: Check existence of database - prevent race condition ***"
until psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" -c '\q' 2> /dev/null; do
  echo "Waiting for database \"$DB\" to be created..."
  sleep 1
done

### --------------- Create Drizzle Schema  --------------- ###
echo "*** Postgres Initialization: Create drizzle schema ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  CREATE SCHEMA IF NOT EXISTS drizzle;
EOSQL

### --------------- Create database users  --------------- ###

echo "*** Postgres Initialization: Create service user ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  CREATE USER $USER_SERVICE WITH PASSWORD '$PASSWORD_SERVICE';
  GRANT CONNECT ON DATABASE "$DB" TO $USER_SERVICE;
EOSQL

echo "*** Postgres Initialization: Create migrator user ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  CREATE USER $USER_MIGRATOR WITH PASSWORD '$PASSWORD_MIGRATOR';
  GRANT ALL PRIVILEGES ON DATABASE "$DB" TO $USER_MIGRATOR;
EOSQL

### --------------- Create user permissions  --------------- ###

echo "*** Postgres Initialization: Amend service user permissions ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  GRANT USAGE ON SCHEMA public TO $USER_SERVICE;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $USER_SERVICE;
  GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO $USER_SERVICE;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO $USER_SERVICE;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $USER_SERVICE;
EOSQL

echo "*** Postgres Initialization: Amend migrator user permissions ***"
psql -v ON_ERROR_STOP=1 --username="$USER_SUPER" --dbname="$DB" <<- EOSQL
  GRANT USAGE, CREATE ON SCHEMA drizzle TO $USER_MIGRATOR;
  GRANT USAGE, CREATE ON SCHEMA public TO $USER_MIGRATOR;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $USER_MIGRATOR;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $USER_MIGRATOR;
  GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $USER_MIGRATOR;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $USER_MIGRATOR;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $USER_MIGRATOR;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $USER_MIGRATOR;
EOSQL

echo "*** Postgres Initialization: Allow future privileges ***"
psql -v ON_ERROR_STOP=1 --username="$USER_MIGRATOR" --dbname="$DB" <<- EOSQL
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $USER_SERVICE;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO $USER_SERVICE;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO $USER_SERVICE;
EOSQL

echo "*** Postgres Initialization: Complete ***"
