#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: node-express-healthcheck.sh
# Description: polls the healthcheck endpoint of a node-express docker service
# Usage: test: ['CMD', '/bin/sh', '/usr/local/bin/node-express-healthcheck.sh']
# -----------------------------------------------------------------------------

: "${EXPRESS_CONTAINER:?EXPRESS_CONTAINER variable is required}"
: "${EXPRESS_DOCKER_PORT:?EXPRESS_DOCKER_PORT variable is required}"

host="${EXPRESS_CONTAINER}"
port="${EXPRESS_DOCKER_PORT}"

wget --spider -q "http://${host}:${port}/health"
