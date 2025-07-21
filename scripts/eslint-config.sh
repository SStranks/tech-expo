#!/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: eslint-config
# Description: Runs eslint --print-config on a specific file in the monorepo,
#              using the .eslint.config.js configuration file.
# Usage: Root package.json: pnpm eslint:config <relative-path-to-file>
# Example: pnpm -w eslint:config apps/crm/server/src/server.ts
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly SCRIPT_DIR
# shellcheck source=/dev/null
source "$SCRIPT_DIR/dir-paths.sh"
check_dirpath_vars || exit 1

readonly TARGET_FILE="$1"
readonly FULL_PATH="$ROOT_DIR_PATH/$TARGET_FILE"
TIMESTAMP=$(date +%Y%m%d-%H%M%S) && readonly TIMESTAMP


if [ -z "$TARGET_FILE" ]; then
  echo "[SCRIPT: eslint-app] Usage: eslint-app.sh <relative-path-to-app>"
  exit 1
fi

if [ ! -e "$FULL_PATH" ]; then
  echo "[SCRIPT: eslint-app] Error: Path '$FULL_PATH' does not exist"
  exit 1
fi

eslint --print-config "$FULL_PATH" > "$LOGS_DIR_PATH/logs/eslint/$TARGET_FILE.$TIMESTAMP.txt"
