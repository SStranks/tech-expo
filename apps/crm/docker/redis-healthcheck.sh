#!/usr/bin/env sh
set -euo pipefail

PASSWORD="$(cat /run/secrets/redis_password)"

echo -e "AUTH $PASSWORD\nPING" | redis-cli --no-auth-warning --raw > /dev/null