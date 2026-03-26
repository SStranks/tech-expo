#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Script: redisinsight-init.sh
# Description: initializes the redisinsight docker service
# Usage: entrypoint: ['/usr/local/bin/redisinsight-init.sh']
# -----------------------------------------------------------------------------

RI_REDIS_HOST0="${REDIS_CONTAINER}"
RI_REDIS_PORT0="${REDIS_DOCKER_PORT}"
RI_REDIS_USERNAME0="$(cat /run/secrets/redis_username)"
RI_REDIS_PASSWORD0="$(cat /run/secrets/redis_password)"
RI_REDIS_TLS0="true"
RI_REDIS_TLS_CA_PATH0="/etc/redisinsight/certs/redisinsight-ca.crt"
RI_REDIS_TLS_CERT_PATH0="/etc/redisinsight/certs/redisinsight-redis.crt"
RI_REDIS_TLS_KEY_PATH0="/etc/redisinsight/certs/redisinsight-redis.key"
RI_SERVER_TLS_CERT="/etc/redisinsight/certs/redisinsight.crt"
RI_SERVER_TLS_KEY="/etc/redisinsight/certs/redisinsight.key"

: "${RI_REDIS_PASSWORD0:?redis_password is empty}"

export RI_REDIS_HOST0
export RI_REDIS_PORT0
export RI_REDIS_USERNAME0
export RI_REDIS_PASSWORD0
export RI_REDIS_TLS0
export RI_REDIS_TLS_CA_PATH0
export RI_REDIS_TLS_CERT_PATH0
export RI_REDIS_TLS_KEY_PATH0
export RI_SERVER_TLS_KEY
export RI_SERVER_TLS_CERT

exec /usr/src/app/docker-entry.sh node redisinsight/api/dist/src/main
