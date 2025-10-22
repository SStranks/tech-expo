#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: redis-healthcheck.sh
# Description: polls the healthcheck endpoint of a redis docker service
# Usage: test: ['CMD', '/bin/sh', '/usr/local/bin/scripts/redis-healthcheck.sh']
# -----------------------------------------------------------------------------


PASSWORD="$(cat /run/secrets/redis_password)"

: "${PASSWORD:?redis_password is empty}"

if redis-cli --no-auth-warning --raw \
  --tls \
  --cacert /etc/redis/certs/redis-ca.crt \
  --cert /etc/redis/certs/redis-healthcheck.crt \
  --key /etc/redis/certs/redis-healthcheck.key \
  -h 127.0.0.1 -p 6379 \
  -a "$PASSWORD" ping | grep -q PONG; then
  echo "Redis command succeeded"
  exit 0
else
  echo "Redis command failed"
  exit 1
fi
