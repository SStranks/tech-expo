#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: grafana-init.sh
# Description: initializes the grafana docker service
# Usage: entrypoint: ['/usr/local/bin/grafana-init.sh']
# -----------------------------------------------------------------------------

GF_SECURITY_DATASOURCE_PROMETHEUS_USER="$(cat /run/secrets/prometheus_username)"
GF_SECURITY_DATASOURCE_PROMETHEUS_PASSWORD="$(cat /run/secrets/prometheus_password)"
GF_SECURITY_RBAC_USERS_USER1="$(cat /run/secrets/grafana_user1_username)"
GF_SECURITY_RBAC_USERS_USER1_PASSWORD="$(cat /run/secrets/grafana_user1_password)"

: "${GF_SECURITY_DATASOURCE_PROMETHEUS_USER:?prometheus_user is empty}"
: "${GF_SECURITY_DATASOURCE_PROMETHEUS_PASSWORD:?prometheus_password is empty}"
: "${GF_SECURITY_RBAC_USERS_USER1:?rafana_user1_login is empty}"
: "${GF_SECURITY_RBAC_USERS_USER1_PASSWORD:?rafana_user1_password is empty}"

export GF_SECURITY_DATASOURCE_PROMETHEUS_USER
export GF_SECURITY_DATASOURCE_PROMETHEUS_PASSWORD
export GF_SECURITY_RBAC_USERS_USER1
export GF_SECURITY_RBAC_USERS_USER1_PASSWORD

# Execute grafana
/run.sh
