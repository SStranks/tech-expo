#!/bin/sh
set -euo pipefail

PASS="$(cat /run/secrets/redis_password)"

echo -e "AUTH $PASS\nPING" | redis-cli --no-auth-warning --raw > /dev/null