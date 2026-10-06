#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: secretlint-app
# Description: Runs secretlint on a specific app folder in the monorepo,
#              using the .secretlintrc.js configuration file.
# Usage: Root package.json: pnpm secretlint:app <relative-path-to-app>
# Example: pnpm -w secretlint:app apps/crm/server
# -----------------------------------------------------------------------------

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly script_dir
# shellcheck source=/dev/null
source "${script_dir}/dir-paths.sh"
check_dirpath_vars || exit 1

readonly target_dir_path="$1"
readonly full_path="${ROOT_DIR_PATH}/${target_dir_path}"
timestamp="$(date +%Y%m%d-%H%M%S)" && readonly timestamp
readonly output_file="${LOGS_DIR_PATH}/secretlint/log.${timestamp}.txt"

if [[ -z "${target_dir_path}" ]]; then
  echo "[SCRIPT: secretlint-app] Usage: secretlint.sh <relative-path-to-app>"
  exit 1
fi

if [[ ! -e "${full_path}" ]]; then
  echo "[SCRIPT: secretlint-app] Error: Path '${full_path}' does not exist"
  exit 1
fi

echo "[SCRIPT: secretlint-app] Running Secretlint with stylish report"
echo "[SCRIPT: secretlint-app] Output: ${output_file}"

secretlint --secretlintignore "${ROOT_DIR_PATH}/.gitignore" \
  --format=stylish --no-color --output="${output_file}" "${full_path}"
