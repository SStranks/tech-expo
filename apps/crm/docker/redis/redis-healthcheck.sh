#!/usr/bin/env sh
set -eu

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
else
  echo "Redis command failed"
  exit 1
fi

redis-cli --no-auth-warning --raw \
  --tls \
  --cacert /etc/redis/certs/redis-ca.crt \
  --cert /etc/redis/certs/redis-healthcheck.crt \
  --key /etc/redis/certs/redis-healthcheck.key \
  -h 127.0.0.1 -p 6379 \
  -a "$PASSWORD" ping | grep -q PONG
