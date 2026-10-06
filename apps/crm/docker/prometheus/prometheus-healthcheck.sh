#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: prometheus-healthcheck.sh
# Description: polls the healthcheck endpoint of a prometheus docker service
# Usage: test: ['CMD', '/bin/sh', '/usr/local/bin/scripts/prometheus-healthcheck.sh']
# -----------------------------------------------------------------------------

: "${NGINX_METRICS_DOCKER_PORT_HTTP:?NGINX_METRICS_DOCKER_PORT_HTTP variable is required}"
: "${NGINX_METRICS_CONTAINER:?NGINX_METRICS_CONTAINER variable is required}"

port="${NGINX_METRICS_DOCKER_PORT_HTTP}"
host="${NGINX_METRICS_CONTAINER}"
user="$(cat /run/secrets/prometheus_username)"
password="$(cat /run/secrets/prometheus_password)"

: "${user:?prometheus_user is empty}"
: "${password:?prometheus_password is empty}"

AUTH=$(printf '%s:%s' "$user" "$password" | base64)

wget --spider -q --header="Authorization: Basic $AUTH" "http://${host}:${port}/prometheus/healthcheck"
