#!/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: eslint-app
# Description: Runs eslint on a specific app folder in the monorepo,
#              using the .eslint.config.js configuration file.
# Usage: Root package.json: pnpm eslint:app <relative-path-to-app> [--html]
# Example:
#   pnpm -w eslint:app apps/crm/server          # Console output
#   pnpm -w eslint:app apps/crm/server --html   # HTML report output
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly SCRIPT_DIR
# shellcheck source=/dev/null
source "$SCRIPT_DIR/dir-paths.sh"
check_dirpath_vars || exit 1

readonly TARGET_DIR_PATH="$1"
readonly OUTPUT_MODE="${2:-console}"
readonly FULL_PATH="$ROOT_DIR_PATH/$TARGET_DIR_PATH"
TIMESTAMP=$(date +%Y%m%d-%H%M%S) && readonly TIMESTAMP


if [ -z "$TARGET_DIR_PATH" ]; then
  echo "[SCRIPT: eslint-app] Usage: eslint-app.sh <relative-path-to-app>"
  exit 1
fi

if [ ! -e "$FULL_PATH" ]; then
  echo "[SCRIPT: eslint-app] Error: Path '$FULL_PATH' does not exist"
  exit 1
fi

if [ "$OUTPUT_MODE" == "--html" ]; then
  REPORT_DIR="$LOGS_DIR_PATH/eslint"
  mkdir -p "$REPORT_DIR"
  OUTPUT_FILE="$REPORT_DIR/$TARGET_DIR_PATH/$TIMESTAMP.html"
  echo "[SCRIPT: eslint-app] Running ESLint with HTML report"
  echo "[SCRIPT: eslint-app] Output: $OUTPUT_FILE"
  eslint --format html --output-file "$OUTPUT_FILE" "$FULL_PATH"
  SUMMARY=$(awk '/<div id="overview"/,/<\/div>/' "$OUTPUT_FILE" | sed -e 's/<[^>]*>//g' | xargs)
  echo "[SCRIPT: eslint-app] $SUMMARY"
else
  echo "[SCRIPT: eslint-app] Running ESLint with console output"
  echo "$FULL_PATH"
  eslint "$FULL_PATH"
fi
