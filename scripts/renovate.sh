#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: renovate
# Description: local renovate docker container for debugging configuration.
#              runs against the online repository, using the local config file.
#              dry-run only.
# Usage:    ./renovvate.sh
# Example:  ./renovate.sh
# -----------------------------------------------------------------------------

: "${TECHEXPO_ROOT_ABSOLUTE:?TECHEXPO_ROOT_ABSOLUTE environment variable is required.}"
: "${SECRETS_DIR:?SECRETS_DIR environment variable is required.}"

token=$(cat "${SECRETS_DIR}"/.github/renovate_local.key)
: "${token:?Error: renovate_local.key is missing or empty.}"


current_date=$(date +%Y-%m-%d) && readonly current_date
timestamp="$(date +%H%M%S)" && readonly timestamp
log_path="${TECHEXPO_ROOT_ABSOLUTE}/logs/renovate/${current_date}"
log_file="debug.${timestamp}.log"

log_level="debug"

mkdir -p "${log_path}"

docker run --rm \
  -v "${TECHEXPO_ROOT_ABSOLUTE}":/usr/src/app \
  -w /usr/src/app \
  -e RENOVATE_CONFIG_FILE=/usr/src/app/.github/renovate.jsonc \
  -e RENOVATE_token="$token" \
  -e RENOVATE_HOST_RULES="[{
    \"hostType\": \"github\",
    \"matchHost\": \"https://api.github.com\",
    \"token\": \"$token\"
  }]" \
  -e LOG_LEVEL="$log_level" \
  renovate/renovate:43 \
  --dry-run=full \
  --platform=local \
  > "${log_path}/${log_file}" 2>&1
