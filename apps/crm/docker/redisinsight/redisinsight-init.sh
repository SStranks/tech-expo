#!/usr/bin/env sh
set -eu

RI_REDIS_HOST="${REDIS_CONTAINER}"
RI_REDIS_PORT="${REDIS_DOCKER_PORT}"
RI_REDIS_PASSWORD="$(cat /run/secrets/redis_password)"
RI_REDIS_TLS="true"
RI_REDIS_TLS_CA_PATH="/etc/redisinsight/certs/redisinsight-ca.crt"
RI_REDIS_TLS_CERT_PATH="/etc/redisinsight/certs/redisinsight-redis.crt"
RI_REDIS_TLS_KEY_PATH="/etc/redisinsight/certs/redisinsight-redis.key"
RI_SERVER_TLS_CERT="/etc/redisinsight/certs/redisinsight.crt"
RI_SERVER_TLS_KEY="/etc/redisinsight/certs/redisinsight.key"

: "${RI_REDIS_PASSWORD:?redis_password is empty}"

export RI_REDIS_HOST
export RI_REDIS_PORT
export RI_REDIS_PASSWORD
export RI_REDIS_TLS
export RI_REDIS_TLS_CA_PATH
export RI_REDIS_TLS_CERT_PATH
export RI_REDIS_TLS_KEY_PATH
export RI_SERVER_TLS_KEY
export RI_SERVER_TLS_CERT

exec /usr/src/app/docker-entry.sh node redisinsight/api/dist/src/main
