#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: prometheus-healthcheck.sh
# Description: polls the healthcheck endpoint of a prometheus docker service
# Usage: test: ['CMD', '/bin/sh', '/usr/local/bin/scripts/prometheus-healthcheck.sh']
# -----------------------------------------------------------------------------

PORT="${NGINX_METRICS_DOCKER_PORT_HTTP}"
HOST="${NGINX_METRICS_CONTAINER}"
USER="$(cat /run/secrets/prometheus_username)"
PASSWORD="$(cat /run/secrets/prometheus_password)"

: "${USER:?prometheus_user is empty}"
: "${PASSWORD:?prometheus_password is empty}"

AUTH=$(printf '%s:%s' "$USER" "$PASSWORD" | base64)

wget --spider -q --header="Authorization: Basic $AUTH" "http://${HOST}:${PORT}/prometheus/healthcheck"
