#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Script: pg_hba.sh
# Description: copies the postgres authentication configuration file to the
#              docker service and sets permission/ownership. Runs once on fresh
#              container+volume; runs before starting the service.
# Usage: volumes: - ./postgres/initdb:/docker-entrypoint-initdb.d:ro
# NOTE: Breaking change from Postgres 17 to 18;
# /var/lib/postgresql/data >> /var/lib/postgresql/<VERSION_NO>/docker
# -----------------------------------------------------------------------------

# pg_hba
cp /run/secrets/postgres_pg_hba /var/lib/postgresql/18/docker/pg_hba.conf
chown postgres:postgres /var/lib/postgresql/18/docker/pg_hba.conf
chmod 600 /var/lib/postgresql/18/docker/pg_hba.conf
