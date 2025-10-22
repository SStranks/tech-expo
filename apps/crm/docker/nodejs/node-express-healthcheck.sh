#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: node-express-healthcheck.sh
# Description: polls the healthcheck endpoint of a node-express docker service
# Usage: test: ['CMD', '/bin/sh', '/usr/local/bin/node-express-healthcheck.sh']
# -----------------------------------------------------------------------------

HOST="${EXPRESS_CONTAINER}"
PORT="${EXPRESS_DOCKER_PORT}"

wget --spider -q "http://${HOST}:${PORT}/health"
