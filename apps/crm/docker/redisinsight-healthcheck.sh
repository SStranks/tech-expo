#!/usr/bin/env sh
set -euo pipefail

CONTAINER="${REDISINSIGHT_CONTAINER:-redisinsight}"
PORT="${REDISINSIGHT_DOCKER_PORT:-5540}"
URL="http://${CONTAINER}:${PORT}/api/health"

wget --quiet --spider --tries=1 "$URL"