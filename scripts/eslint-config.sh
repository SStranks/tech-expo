#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: eslint-config
# Description: Runs eslint --print-config on a specific file in the monorepo,
#              using the .eslint.config.js configuration file.
# Usage: Root package.json: pnpm eslint:config <relative-path-to-file>
# Example: pnpm -w eslint:config apps/crm/server/src/server.ts
# -----------------------------------------------------------------------------

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" && readonly script_dir
# shellcheck source=/dev/null
source "${script_dir}/dir-paths.sh"
check_dirpath_vars || exit 1

readonly target_file="$1"
readonly full_path="${ROOT_DIR_PATH}/${target_file}"
timestamp="$(date +%Y%m%d-%H%M%S)" && readonly timestamp


if [[ -z "${target_file}" ]]; then
  echo "[SCRIPT: eslint-app] Usage: eslint-app.sh <relative-path-to-app>"
  exit 1
fi

if [[ ! -e "${full_path}" ]]; then
  echo "[SCRIPT: eslint-app] Error: Path '$full_path' does not exist"
  exit 1
fi

eslint --print-config "${full_path}" > "${LOGS_DIR_PATH}/eslint/${target_file}.${timestamp}.txt"
