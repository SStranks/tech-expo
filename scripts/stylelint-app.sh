#!/usr/bin/env bash
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

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly script_dir
# shellcheck source=/dev/null
source "${script_dir}/dir-paths.sh"
check_dirpath_vars || exit 1

readonly target_dir_path="$1"
readonly output_mode="${2:-console}"
full_path="${ROOT_DIR_PATH}/${target_dir_path}"
timestamp="$(date +%Y%m%d-%H%M%S)" && readonly timestamp


if [[ -z "${target_dir_path}" ]]; then
  echo "[SCRIPT: stylelint-app] Usage: stylelint-app.sh <relative-path-to-app>"
  exit 1
fi

if [[ ! -e "${full_path}" ]]; then
  echo "[SCRIPT: stylelint-app] Error: Path '${full_path}' does not exist"
  exit 1
fi

if [[ -d "${full_path}" ]]; then
  full_path="${full_path}/**/*.{css,scss,sass}"
fi

if [[ "$output_mode" == "--string" ]]; then
  report_dir="${LOGS_DIR_PATH}/stylelint"
  mkdir -p "${report_dir}"
  output_file="${report_dir}/${target_dir_path}.${timestamp}.txt"
  echo "[SCRIPT: stylelint-app] Running Stylelint with TXT report"
  echo "[SCRIPT: stylelint-app] Output: ${output_file}"
  stylelint "${full_path}" --formatter string --output-file "${output_file}" 2>&1 | \
    echo "[SCRIPT: stylelint-app] $(grep -m1 -E 'problem' || echo "✔ 0 Problems (0 Errors, 0 warnings)")" || true
else
  echo "[SCRIPT: stylelint-app] Running Stylelint with console output"
  stylelint "${full_path}"
fi
