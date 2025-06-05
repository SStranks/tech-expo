#!/usr/bin/env bash
set -euo pipefail

CONTAINER="${MONGOEXP_CONTAINER:-mongo-express}"
PORT="${MONGOEXP_DOCKER_PORT:-8081}"
URL="http://${CONTAINER}:${PORT}/status"

wget --quiet --spider --tries=1 "$URL"