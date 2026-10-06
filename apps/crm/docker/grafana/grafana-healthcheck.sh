#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: grafana-healthcheck.sh
# Description: polls the healthcheck endpoint of a grafana docker service
# Usage: test: ['CMD', '/bin/sh', '/usr/local/bin/grafana-healthcheck.sh']
# -----------------------------------------------------------------------------

: "${NGINX_METRICS_DOCKER_PORT_HTTP:?NGINX_METRICS_DOCKER_PORT_HTTP variable is required}"
: "${NGINX_METRICS_CONTAINER:?NGINX_METRICS_CONTAINER variable is required}"

port="${NGINX_METRICS_DOCKER_PORT_HTTP}"
host="${NGINX_METRICS_CONTAINER}"

wget --spider -q "http://${host}:${port}/grafana/healthcheck"
