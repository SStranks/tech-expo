#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: megalint-security
# Description: Runs MegaLinter (v8) on entire repository,
#              using the .mega-linter.security.yaml configuration file.
# Usage: Root package.json: pnpm megalint:security
# Example: pnpm -w megalint:security
# -----------------------------------------------------------------------------

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly script_dir
# shellcheck source=/dev/null
source "${script_dir}/dir-paths.sh"
check_dirpath_vars || exit 1

timestamp="$(date +%Y%m%d-%H%M%S)" && readonly timestamp


docker run --rm \
  -e MEGALINTER_CONFIG=".mega-linter.security.yaml" \
  -e REPORT_OUTPUT_FOLDER="/tmp/lint/logs/megalinter/security/${timestamp}" \
  -v "${ROOT_DIR_PATH}":/tmp/lint \
  ghcr.io/oxsecurity/megalinter:v10.1.0
