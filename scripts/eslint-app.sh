#!/usr/bin/env bash
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

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly script_dir
# shellcheck source=/dev/null
source "${script_dir}/dir-paths.sh"
check_dirpath_vars || exit 1

readonly target_dir_path="$1"
readonly output_mode="${2:-console}"
readonly full_path="${ROOT_DIR_PATH}/${target_dir_path}"
timestamp="$(date +%Y%m%d-%H%M%S)" && readonly timestamp


if [[ -z "${target_dir_path}" ]]; then
  echo "[SCRIPT: eslint-app] Usage: eslint-app.sh <relative-path-to-app>"
  exit 1
fi

if [[ ! -e "${full_path}" ]]; then
  echo "[SCRIPT: eslint-app] Error: Path '${full_path}' does not exist"
  exit 1
fi

if [[ "${output_mode}" == "--html" ]]; then
  report_dir="${LOGS_DIR_PATH}/eslint"
  mkdir -p "${report_dir}"
  output_file="${report_dir}/${target_dir_path}/${timestamp}.html"
  echo "[SCRIPT: eslint-app] Running ESLint with HTML report"
  echo "[SCRIPT: eslint-app] Output: ${output_file}"
  eslint --format html --output-file "${output_file}" "${full_path}" || true
  summary=$(awk '/<div id="overview"/,/<\/div>/' "${output_file}" | sed -e 's/<[^>]*>//g' | xargs)
  echo "[SCRIPT: eslint-app] ${summary}"
else
  echo "[SCRIPT: eslint-app] Running ESLint with console output"
  echo "${full_path}"
  eslint "${full_path}"
fi
