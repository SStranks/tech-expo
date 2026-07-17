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

## CI/CD Encrypted .env file

For Github workflows [`Vitest`](/.github/workflows/vitest.yaml) and [`Playwright`](/.github/workflows/playwright.yaml), an encrypted .env file is committed to the repository that is then decrypted during the online runner process.

[Encrypted CI/CD .env](/apps/crm/client/.env.ci.client.enc)

The `dotenvx` package can be used to securely encrypt env files, and is used by the github runner to decrypt them during the CI/CD pipeline process.

```bash
# apps/crm/client
pnpm exec dotenvx encrypt -f ./.env.ci.client

# Generates:
./.env.ci.client.enc        # encrypted env file
./.env.keys                 # private key file for decryption
```

The encrypted file can remain in the repository, but the `.env.keys` is sensitive information and should be stored external to the repository. To decrypt an `.env.enc` file locally, use the following command:

```bash
# apps/crm/client
pnpm exec dotenvx decrypt -f ./.env.ci.client.enc -fk "{SECRETS_DIR}/secrets/client/.env.keys"
```

To have a github workflow decrypt the encrypted `.env.ci.client.enc` file, the matching private key from the `.env.keys` file is placed into the online github repository under:

```console
Settings > Secrets and Variables > Actions > Secrets > Repository Secrets
```

The private key is then injected into the runner process via the workflow file. For example, in [vitest.yaml](/.github/workflows/vitest.yaml):

```yml
- name: run Storybook tests
        run: pnpm --filter @apps/crm-client exec dotenvx run -f ./.env.ci.client.enc -- vitest run --mode test --config ./vitest.config.ts --project=storybook
        env:
          DOTENV_PRIVATE_KEY_CI_CLIENT: ${{ secrets.DOTENV_PRIVATE_KEY_CI_CLIENT }}
```

For more information please refer to the dotenvx documentation [`github-actions`](https://dotenvx.com/docs/cis/github-actions)
