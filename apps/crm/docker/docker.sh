#!/usr/bin/env bash
set -uo pipefail

# Directory variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRETS_FILE="$SCRIPT_DIR/.secret.yaml"
SECRETS_RAM_DIR="/run/user/$(id -u)/secrets"
ENV_FILE="$SCRIPT_DIR/.env.dev"

# If SECRET_PATH exists in the env file, replace it. Otherwise, append it.
if grep -q '^SECRET_PATH=' "$ENV_FILE"; then
  sed -i "s|^SECRET_PATH=.*|SECRET_PATH=$SECRETS_RAM_DIR|" "$ENV_FILE"
else
  printf "\n\n# Docker Secret Path \nSECRET_PATH=$SECRETS_RAM_DIR" >> "$ENV_FILE"
fi

# Mount secrets folder to RAM
mkdir -p "$SECRETS_RAM_DIR"

# Cleanup function for secret files
cleanup() {
  echo "Cleaning up secret files..."
  find "$SECRETS_RAM_DIR" -type f -name '.secret.*.txt' -delete
  
  # For secure deletion invoke shred; still not guaranteed in case of SSDs; causes wear
  # find "$SECRETS_RAM_DIR" -type f -name '.secret.*.txt' -exec shred -u {} +
}
trap cleanup EXIT

# Decrypt secrets json; output each value in own .txt with key as filename
# YAML Version
sops exec-file "$SECRETS_FILE" 'bash -c "
  SECRETS_RAM_DIR=\"'"$SECRETS_RAM_DIR"'\"

  while IFS= read -r line; do
    # Remove comments and empty lines
    [[ \"\$line\" =~ ^#.*$ || -z \"\$line\" ]] && continue

    # Extract key and value, trimming spaces
    key=\$(echo \"\${line%%:*}\" | xargs)
    val=\$(echo \"\${line#*:}\" | xargs)

    echo -n \"\$val\" > \"\$SECRETS_RAM_DIR/.secret.\${key}.txt\"
  done < \"{}\"
"'


# JSON Version
# sops exec-file "$SECRETS_FILE" 'bash -c "
#   SECRETS_DIR=\"'"$SECRETS_RAM_DIR"'\"

#   while IFS= read -r line; do
#     clean_line=\$(echo \"\$line\" | sed -e '\''s/[\",]//g'\'')
#     [ -z \"\$clean_line\" ] && continue

#     key=\$(echo \"\${clean_line%%:*}\" | xargs)
#     val=\$(echo \"\${clean_line#*:}\" | xargs)

#     echo -n \"\$val\" > \"\$SECRETS_RAM_DIR/.secret.\${key}.txt\"
#   done < <(grep -v '\''^{\|^}'\'' \"{}\" | tr \",\" \"\n\")
# "'

# Run Docker compose outside of SOPS context
# Running inside interferes with docket rootless and breaks
docker compose -f "$SCRIPT_DIR/docker-compose.override.yml" \
  --env-file "$SCRIPT_DIR/.env.dev" \
  --profile "*" up