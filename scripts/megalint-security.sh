#!/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: megalint-security
# Description: Runs MegaLinter (v8) on entire repository,
#              using the .mega-linter.security.yaml configuration file.
# Usage: Root package.json: pnpm megalint:security
# Example: pnpm -w megalint:security
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly SCRIPT_DIR
# shellcheck source=/dev/null
source "$SCRIPT_DIR/dir-paths.sh"
check_dirpath_vars || exit 1

TIMESTAMP=$(date +%Y%m%d-%H%M%S) && readonly TIMESTAMP


docker run --rm \
  -e MEGALINTER_CONFIG=".mega-linter.security.yaml" \
  -e REPORT_OUTPUT_FOLDER="/tmp/lint/logs/megalinter/security/${TIMESTAMP}" \
  -v "$ROOT_DIR_PATH":/tmp/lint \
  oxsecurity/megalinter:v9
