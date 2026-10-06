#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: redisinsight-healthcheck.sh
# Description: polls the healthcheck endpoint of a redisinsight docker service
# Usage: test: ['CMD', '/bin/sh', '/usr/local/bin/scripts/redisinsight-healthcheck.sh']
# -----------------------------------------------------------------------------

: "${REDISINSIGHT_DOCKER_PORT:?REDISINSIGHT_DOCKER_PORT variable is required}"

port="${REDISINSIGHT_DOCKER_PORT}"
url="https://127.0.0.1:${port}/api/health"

wget --quiet --spider --tries=1 --no-check-certificate "$url"
