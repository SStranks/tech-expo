#!/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: stylelint-app
# Description: Runs stylelint on a specific app folder in the monorepo,
#              using the stylelint.config.js configuration file.
# Usage: Root package.json: pnpm stylelint:app <relative-path-to-app> [--string]
# Example: pnpm -w stylelint:app apps/crm/server
#   pnpm -w stylelint:app apps/crm/server            # Console output
#   pnpm -w stylelint:app apps/crm/server --string   # .txt report output
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly SCRIPT_DIR
# shellcheck source=/dev/null
source "$SCRIPT_DIR/dir-paths.sh"
check_dirpath_vars || exit 1

readonly TARGET_DIR_PATH="$1"
readonly OUTPUT_MODE="${2:-console}"
FULL_PATH="$ROOT_DIR_PATH/$TARGET_DIR_PATH"
TIMESTAMP=$(date +%Y%m%d-%H%M%S) && readonly TIMESTAMP


if [ -z "$TARGET_DIR_PATH" ]; then
  echo "[SCRIPT: stylelint-app] Usage: stylelint-app.sh <relative-path-to-app>"
  exit 1
fi

if [ ! -e "$FULL_PATH" ]; then
  echo "[SCRIPT: stylelint-app] Error: Path '$FULL_PATH' does not exist"
  exit 1
fi

if [ -d "$FULL_PATH" ]; then
  FULL_PATH="$FULL_PATH/**/*.{css,scss,sass}"
fi

if [ "$OUTPUT_MODE" == "--string" ]; then
  REPORT_DIR="$LOGS_DIR_PATH/stylelint"
  mkdir -p "$REPORT_DIR"
  OUTPUT_FILE="$REPORT_DIR/$TARGET_DIR_PATH.$TIMESTAMP.txt"
  echo "[SCRIPT: stylelint-app] Running Stylelint with TXT report: $OUTPUT_FILE"
  stylelint "$FULL_PATH" --formatter string --output-file "$OUTPUT_FILE"
else
  echo "[SCRIPT: stylelint-app] Running Stylelint with console output"
  stylelint "$FULL_PATH"
fi
