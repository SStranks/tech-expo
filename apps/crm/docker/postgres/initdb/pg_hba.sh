#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Script: pg_hba.sh
# Description: copies the postgres authentication configuration file to the
#              docker service and sets permission/ownership. Runs once on fresh
#              container+volume; runs before starting the service.
# Usage: volumes: - ./postgres/initdb:/docker-entrypoint-initdb.d:ro
# -----------------------------------------------------------------------------

# pg_hba
cp /run/secrets/postgres_pg_hba /var/lib/postgresql/data/pg_hba.conf
chown postgres:postgres /var/lib/postgresql/data/pg_hba.conf
chmod 600 /var/lib/postgresql/data/pg_hba.conf
