#!/usr/bin/env sh
set -eu

HOST="${EXPRESS_CONTAINER}"
PORT="${EXPRESS_DOCKER_PORT}"

wget --spider -q "http://${HOST}:${PORT}/health"
