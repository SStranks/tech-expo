#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: megalint-app-lint
# Description: Runs MegaLinter (v8) on a specific app folder in the monorepo,
#              using the .mega-linter.lint.yaml configuration file.
# Usage: Root package.json: pnpm megalint:app:lint <relative-path-to-app>
# Example: pnpm -w megalint:app:lint apps/crm/server
# -----------------------------------------------------------------------------

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly script_dir
# shellcheck source=/dev/null
source "${script_dir}/dir-paths.sh"
check_dirpath_vars || exit 1

readonly target_dir="$1"
readonly full_path="${ROOT_DIR_PATH}/${target_dir}"
timestamp="$(date +%Y%m%d-%H%M%S)" && readonly timestamp


if [[ -z "${target_dir}" ]]; then
  echo "[SCRIPT: megalint-app-lint] Usage: megalint-app-lint.sh <relative-path-to-app>"
  exit 1
fi

if [[ ! -e "${full_path}" ]]; then
  echo "[SCRIPT: megalint-app-lint] Error: Path '${full_path}' does not exist"
  exit 1
fi

docker run --rm \
  -e MEGALINTER_CONFIG="/tmp/lint/.mega-linter.lint.yaml" \
  -e REPORT_OUTPUT_FOLDER="/tmp/lint/logs/megalinter/${target_dir}_${timestamp}" \
  -e FILTER_REGEX_INCLUDE="${target_dir}" \
  -v "${ROOT_DIR_PATH}":/tmp/lint \
  ghcr.io/oxsecurity/megalinter:v10.1.0
