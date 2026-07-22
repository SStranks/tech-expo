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

: "${TECHEXPO_ROOT_ABSOLUTE:? TECHEXPO_ROOT_ABSOLUTE environment variable is required.}"
: "${SECRETS_DIR:? SECRETS_DIR environment variable is required.}"

TOKEN=$(cat "${SECRETS_DIR}"/.github/renovate_local.key)
: "${TOKEN:?Error: renovate_local.key is missing or empty.}"


CURRENT_DATE=$(date +%Y-%m-%d) && readonly CURRENT_DATE
TIMESTAMP="$(date +%H%M%S)" && readonly TIMESTAMP
LOG_PATH="${TECHEXPO_ROOT_ABSOLUTE}/logs/renovate/${CURRENT_DATE}"
LOG_FILE="debug.${TIMESTAMP}.log"

LOG_LEVEL="debug"

mkdir -p "${LOG_PATH}"

docker run --rm \
  -v "${TECHEXPO_ROOT_ABSOLUTE}":/usr/src/app \
  -w /usr/src/app \
  -e RENOVATE_CONFIG_FILE=/usr/src/app/.github/renovate.jsonc \
  -e RENOVATE_TOKEN="$TOKEN" \
  -e RENOVATE_HOST_RULES="[{
    \"hostType\": \"github\",
    \"matchHost\": \"https://api.github.com\",
    \"token\": \"$TOKEN\"
  }]" \
  -e LOG_LEVEL="$LOG_LEVEL" \
  renovate/renovate:43 \
  --dry-run=full \
  --platform=local \
  > "${LOG_PATH}/${LOG_FILE}" 2>&1
