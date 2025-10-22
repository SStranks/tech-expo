#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: grafana-healthcheck.sh
# Description: polls the healthcheck endpoint of a grafana docker service
# Usage: test: ['CMD', '/bin/sh', '/usr/local/bin/grafana-healthcheck.sh']
# -----------------------------------------------------------------------------

PORT="${NGINX_METRICS_DOCKER_PORT_HTTP}"
HOST="${NGINX_METRICS_CONTAINER}"

wget --spider -q "http://${HOST}:${PORT}/grafana/healthcheck"
