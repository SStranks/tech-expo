#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: mongo-express-healthcheck.sh
# Description: polls the healthcheck endpoint of a mongo-express docker service
# Usage: test: ['CMD', '/bin/bash', '/usr/local/bin/mongo-express-healthcheck.sh']
# -----------------------------------------------------------------------------

: "${MONGOEXPRESS_DOCKER_PORT:?MONGOEXPRESS_DOCKER_PORT variable is required}"

port="${MONGOEXPRESS_DOCKER_PORT}"
url="http://127.0.0.1:${port}/status"

wget --quiet --spider --tries=1 "$url"
