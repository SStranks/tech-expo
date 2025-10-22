#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: redis-init.sh
# Description: initializes the redis docker service
# Usage: entrypoint: ['/usr/local/bin/redis-init.sh']
# -----------------------------------------------------------------------------

PASSWORD="$(cat /run/secrets/redis_password)"

: "${PASSWORD:?redis_password is empty}"

exec docker-entrypoint.sh redis-server \
  --maxmemory 1gb \
  --port 0 \
  --tls-port 6379 \
  --tls-cert-file /etc/redis/certs/redis.crt \
  --tls-key-file /etc/redis/certs/redis.key \
  --tls-ca-cert-file /etc/redis/certs/redis-ca.crt \
  --tls-auth-clients yes \
  --requirepass "$PASSWORD" \
  --loglevel warning \
  "$@"
