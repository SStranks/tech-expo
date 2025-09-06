#!/usr/bin/env sh
set -eu

PORT="${NGINX_PROXY_1_DOCKER_PORT_HTTP}"
HOST="${NGINX_PROXY_1_CONTAINER}"
USER="$(cat /run/secrets/prometheus_username)"
PASSWORD="$(cat /run/secrets/prometheus_password)"

: "${USER:?prometheus_user is empty}"
: "${PASSWORD:?prometheus_password is empty}"

AUTH=$(printf '%s:%s' "$USER" "$PASSWORD" | base64)

wget --spider -q --header="Authorization: Basic $AUTH" "http://${HOST}:${PORT}/prometheus/healthcheck"
