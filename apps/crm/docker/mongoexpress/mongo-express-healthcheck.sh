#!/usr/bin/env bash
set -euo pipefail

PORT="${MONGOEXPRESS_DOCKER_PORT}"
URL="http://127.0.0.1:${PORT}/status"

wget --quiet --spider --tries=1 "$URL"
