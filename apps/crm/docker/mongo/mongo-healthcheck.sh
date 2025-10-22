#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: mongo-healthcheck.sh
# Description: polls the healthcheck endpoint of a mongo docker service
# Usage: test: ['CMD', '/bin/bash', '/usr/local/bin/mongo-healthcheck.sh']
# -----------------------------------------------------------------------------

HOST="${MONGO_CONTAINER}:${MONGO_DOCKER_PORT}"
DB="$(cat /run/secrets/mongo_database)"
USER_ROOT="$(cat /run/secrets/mongo_user_root)"
PASSWORD_ROOT="$(cat /run/secrets/mongo_password_root)"
TLS_CERT="/etc/mongo/certs/mongo-healthcheck.pem"
TLS_CA="/etc/mongo/certs/mongo-ca.crt"

: "${DB:?mongo_database is empty}"
: "${USER_ROOT:?mongo_user_root is empty}"
: "${PASSWORD_ROOT:?mongo_password_root is empty}"

mongosh "$HOST/$DB" \
  --username "$USER_ROOT" \
  --password "$PASSWORD_ROOT" \
  --authenticationDatabase admin \
  --tls \
  --tlsCertificateKeyFile "$TLS_CERT" \
  --tlsCAFile "$TLS_CA" \
  --quiet \
  --eval 'db.runCommand({ ping: 1 }).ok' | grep 1 > /dev/null
