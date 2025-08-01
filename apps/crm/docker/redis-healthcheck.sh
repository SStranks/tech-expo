#!/usr/bin/env sh
set -euo

PASSWORD="$(cat /run/secrets/redis_password)"

if printf "AUTH %s\nPING\n" "$PASSWORD" | redis-cli --no-auth-warning --raw > /dev/null; then
  echo "Redis command succeeded"
else
  echo "Redis command failed"
  exit 1
fi

printf "AUTH %s\nPING\n" "$PASSWORD" | redis-cli --no-auth-warning --raw > /dev/null
