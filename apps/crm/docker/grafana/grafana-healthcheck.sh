#!/usr/bin/env sh
set -eu

PORT="${NGINX_METRICS_DOCKER_PORT_HTTP}"
HOST="${NGINX_METRICS_CONTAINER}"

wget --spider -q "http://${HOST}:${PORT}/grafana/healthcheck"
