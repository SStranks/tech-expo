#!/usr/bin/env sh
set -e

PASSWORD="$(cat /run/secrets/redis_password)"

exec docker-entrypoint.sh redis-server --save 20 1 --loglevel warning --requirepass "$PASSWORD"
