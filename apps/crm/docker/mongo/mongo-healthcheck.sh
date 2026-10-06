#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: mongo-healthcheck.sh
# Description: polls the healthcheck endpoint of a mongo docker service
# Usage: test: ['CMD', '/bin/bash', '/usr/local/bin/mongo-healthcheck.sh']
# -----------------------------------------------------------------------------

: "${MONGO_CONTAINER:?MONGO_CONTAINER variable is required}"
: "${MONGO_DOCKER_PORT:?MONGO_DOCKER_PORT variable is required}"

host="${MONGO_CONTAINER}:${MONGO_DOCKER_PORT}"
db="$(cat /run/secrets/mongo_database)"
user_root="$(cat /run/secrets/mongo_user_root)"
password_root="$(cat /run/secrets/mongo_password_root)"
tls_cert="/etc/mongo/certs/mongo-healthcheck.pem"
tls_ca="/etc/mongo/certs/mongo-ca.crt"

: "${db:?mongo_database is empty}"
: "${user_root:?mongo_user_root is empty}"
: "${password_root:?mongo_password_root is empty}"

mongosh "$host/$db" \
  --username "$user_root" \
  --password "$password_root" \
  --authenticationDatabase admin \
  --tls \
  --tlsCertificateKeyFile "$tls_cert" \
  --tlsCAFile "$tls_ca" \
  --quiet \
  --eval 'db.runCommand({ ping: 1 }).ok' | grep 1 > /dev/null
