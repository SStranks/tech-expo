#!/usr/bin/env bash
set -e

# pg_hba
cp /run/secrets/postgres_pg_hba /var/lib/postgresql/data/pg_hba.conf
chown postgres:postgres /var/lib/postgresql/data/pg_hba.conf
chmod 600 /var/lib/postgresql/data/pg_hba.conf
