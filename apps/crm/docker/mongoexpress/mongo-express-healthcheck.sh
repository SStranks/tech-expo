#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: mongo-express-healthcheck.sh
# Description: polls the healthcheck endpoint of a mongo-express docker service
# Usage: test: ['CMD', '/bin/bash', '/usr/local/bin/mongo-express-healthcheck.sh']
# -----------------------------------------------------------------------------

PORT="${MONGOEXPRESS_DOCKER_PORT}"
URL="http://127.0.0.1:${PORT}/status"

wget --quiet --spider --tries=1 "$URL"
