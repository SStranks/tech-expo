#!/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: megalint-app-lint
# Description: Runs MegaLinter (v8) on a specific app folder in the monorepo,
#              using the .mega-linter.lint.yaml configuration file.
# Usage: Root package.json: pnpm megalint:app:lint <relative-path-to-app>
# Example: pnpm -w megalint:app:lint apps/crm/server
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly SCRIPT_DIR
# shellcheck source=/dev/null
source "$SCRIPT_DIR/dir-paths.sh"
check_dirpath_vars || exit 1

readonly TARGET_DIR="$1"
readonly FULL_PATH="$ROOT_DIR_PATH/$TARGET_DIR"
TIMESTAMP=$(date +%Y%m%d-%H%M%S) && readonly TIMESTAMP


if [ -z "$TARGET_DIR" ]; then
  echo "[SCRIPT: megalint-app-lint] Usage: megalint-app-lint.sh <relative-path-to-app>"
  exit 1
fi

if [ ! -e "$FULL_PATH" ]; then
  echo "[SCRIPT: megalint-app-lint] Error: Path '$FULL_PATH' does not exist"
  exit 1
fi

docker run --rm \
  -e MEGALINTER_CONFIG="/tmp/lint/.mega-linter.lint.yaml" \
  -e REPORT_OUTPUT_FOLDER="/tmp/lint/logs/megalinter/${TARGET_DIR}_${TIMESTAMP}" \
  -e FILTER_REGEX_INCLUDE="$TARGET_DIR" \
  -v "$ROOT_DIR_PATH":/tmp/lint \
  oxsecurity/megalinter:v9
