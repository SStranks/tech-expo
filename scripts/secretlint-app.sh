#!/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: secretlint-app
# Description: Runs secretlint on a specific app folder in the monorepo,
#              using the .secretlintrc.js configuration file.
# Usage: Root package.json: pnpm secretlint:app <relative-path-to-app>
# Example: pnpm -w secretlint:app apps/crm/server
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly SCRIPT_DIR
# shellcheck source=/dev/null
source "$SCRIPT_DIR/dir-paths.sh"
check_dirpath_vars || exit 1

readonly TARGET_DIR_PATH="$1"
readonly FULL_PATH="$ROOT_DIR_PATH/$TARGET_DIR_PATH"
TIMESTAMP=$(date +%Y%m%d-%H%M%S) && readonly TIMESTAMP


if [ -z "$TARGET_DIR_PATH" ]; then
  echo "[SCRIPT: secretlint-app] Usage: secretlint.sh <relative-path-to-app>"
  exit 1
fi

if [ ! -e "$FULL_PATH" ]; then
  echo "[SCRIPT: secretlint-app] Error: Path '$FULL_PATH' does not exist"
  exit 1
fi

echo "[SCRIPT: secretlint-app] Running Secretlint with stylish report"
OUTPUT_FILE="$LOGS_DIR_PATH/secretlint/log.$TIMESTAMP.txt"
echo "[SCRIPT: secretlint-app] Output: $OUTPUT_FILE"

secretlint --secretlintignore "$ROOT_DIR_PATH/.gitignore" \
  --format=stylish --no-color --output="$OUTPUT_FILE" "$FULL_PATH"
