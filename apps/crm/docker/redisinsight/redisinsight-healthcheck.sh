#!/usr/bin/env sh
set -eu

PORT="${REDISINSIGHT_DOCKER_PORT}"
URL="https://127.0.0.1:${PORT}/api/health"

wget --quiet --spider --tries=1 --no-check-certificate "$URL"
