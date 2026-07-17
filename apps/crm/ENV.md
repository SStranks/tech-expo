# Environment Variables Setup

## Preamble

- `.env` files should not be used to store secrets or sensitive information.
- They should not be committed to online repositories unencrypted; the safest policy is avoid committing at all and use alternatives e.g. [Github Actions Secrets and Variables](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets#creating-secrets-for-a-repository)

Using `.gitignore` to exclude `.env` files is a typical convention but not recommended. The purpose of Git is to track files within a repository, and therefore all files intentionally excluded from its scope are subject to potential data loss. Git retains authority over a repository folder and untracked files are vulnerable to `git clean` commands invoked intentionally or by third-parties.

## Architecture

Locating `.env` files in a sibling folder relative to the repository folder - that is not monitored by git - provides a safe and centralized store, bypassing potential data loss and unintentional commits of semi-sensitive configuration details.

The naming and structure of the private env store can be customized according to the needs of the project - see [`direnv`](#direnv) for more details.

```console
./
├─ tech-expo/                           # project repository
├─ private/                             # global env store
│  ├─ project-1/
│  └─ tech-expo/                        # tech-expo project
│     ├─ backup/
│     ├─ certs/
│     ├─ docs/
│     ├─ encrypted/
│     ├─ env/                           # tech-expo env store
│     ├─ script/
│     ├─ secrets/
```

### direnv

[direnv](https://direnv.net/) is a shell extension that allows automatic loading/unloading of environment variables depending on the active directory. Supported shells: bash, zsh, tcsh, fish, elvish, powershell, murex, nushell.

[Installation](https://direnv.net/docs/installation.html) requires adding the package to your distribution and placing a simple one-line hook into your shell configuration file.

##### .envrc file

A `.envrc` file defines environment variables for a specific directory that direnv will automatically load - variables will be available for all sub-folders unless they contain their own `.envrc` file.

```ini
# ./.envrc

#!/usr/bin/env sh
export TECH_EXPO_PRIVATE="/projects/private/tech-expo"

export ENV_DIR="${TECH_EXPO_PRIVATE}/env"
export SECRETS_DIR="${TECH_EXPO_PRIVATE}/secrets"
export CERTS_DIR="${TECH_EXPO_PRIVATE}/certs"
```

The command `direnv allow` must be invoked in the directory of the `.envrc` file to safely allow the extension to process the environment variables.

##### Usage

```ini
# apps/crm/client/package.json

"start": "dotenvx run -f \"${ENV_DIR}/.env.dev.client\" -- webpack serve --disable-interpret --config ./webpack/webpack.dev.ts"
```

```ini
# apps/crm/docker/docker-compose.override.yml

services:
  express-api:
    env_file:
      - ${ENV_DIR}/.env.dev.server
      - ${ENV_DIR}/.env.dev.docker
```

## Service specific .env Files

Please refer to the `README.md` for each respective service layer for details on configuration of specific environment variables.

- [`README`](/apps/crm/client/README.md#required-files) - Client
- [`README`](/apps/crm/server/README.md#required-files) - Server
- [`README`](/apps/crm/docker/README.md#required-files) - Docker
