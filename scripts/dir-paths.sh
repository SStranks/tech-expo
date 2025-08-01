#!/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Script: dir-paths
# Description: Sets variables of absolute directory paths to project folders
#              for consumption within other bash scripts
# Usage: In all reporter scripts; source ./dir-paths.sh
# Example: source ./dir-paths.sh
# -----------------------------------------------------------------------------

ROOT_DIR_PATH=$(pnpm -w exec pwd)
readonly ROOT_DIR_PATH
readonly LOGS_DIR_PATH="$ROOT_DIR_PATH/logs"
readonly SCRIPTS_DIR_PATH="$ROOT_DIR_PATH/scripts"

export ROOT_DIR_PATH
export LOGS_DIR_PATH
export SCRIPTS_DIR_PATH

check_dirpath_vars() {
  local required_vars=(ROOT_DIR_PATH LOGS_DIR_PATH SCRIPTS_DIR_PATH)
  for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
      echo "[SCRIPT: dir-paths] Error: $var is not set"
      return 1
    fi
  done
}
