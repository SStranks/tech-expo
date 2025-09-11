/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'node:fs';
import path from 'node:path';

type TSecretName = (typeof REQUIRED_SECRETS)[number];

const DOCKER_SECRET_PATH = '/run/secrets';
const REQUIRED_SECRETS = [
  'DEMO_ACC_GENERIC_NON_USER_PASSWORD',
  'GRAPHQL_INTROSPECT_AUTH',
  'JWT_AUTH_SECRET',
  'JWT_REFRESH_SECRET',
  'MONGO_DATABASE',
  'MONGO_PASSWORD_SERVICE',
  'MONGO_USER_SERVICE',
  'NODEMAILER_DEV_EMAIL',
  'NODEMAILER_PASSWORD',
  'NODEMAILER_USERNAME',
  'POSTGRES_DATABASE',
  'POSTGRES_PASSWORD_SERVICE',
  'POSTGRES_PEPPER',
  'POSTGRES_USER_SERVICE',
  'POSTGRES_URL',
  'REDIS_PASSWORD',
  'REDIS_USERNAME',
] as const;

const secrets: Record<TSecretName, string> = {} as Record<TSecretName, string>;
let secretsFiles: string[] = [];

function abortServerInitialization(error: Error) {
  console.log('[secrets.js] FAILURE: Aborted loading process\n', error);
  // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
  process.exit(1);
}

function getDockerSecret(secretName: string) {
  try {
    const dockerSecret = fs.readFileSync(`${DOCKER_SECRET_PATH}/${secretName}`, 'utf8').trim();
    if (dockerSecret === '') throw new Error(`${secretName} was parsed as empty string`);
    return dockerSecret;
  } catch (error) {
    throw new Error(`[secrets.js] FAILURE: Could not load ${secretName} secret: ${(error as Error).message}`);
  }
}

function getAllSecretsFiles() {
  try {
    const getAllInSecretsDir = fs.readdirSync(DOCKER_SECRET_PATH);
    const secretFiles = getAllInSecretsDir.filter((file) => {
      const fullPath = path.join(DOCKER_SECRET_PATH, file);
      return fs.statSync(fullPath).isFile(); // Filter out dirs if any
    });
    return secretFiles;
  } catch {
    throw new Error('[secrets.js] FAILURE: failed to get all secrets files');
  }
}

function validateSecretsCount(secretsFiles: string[]): void | Error {
  if (secretsFiles.length !== Object.keys(REQUIRED_SECRETS).length)
    throw new Error('[secrets.js] FAILURE: incongruency between number of actual and required secrets');
}

function validateAndNormalizeSecretName(filename: string): TSecretName {
  if (!(REQUIRED_SECRETS as readonly string[]).includes(filename.toUpperCase()))
    throw new Error(`[secrets.js] FAILURE: found secret not in required. secret file: ${filename}`);
  return filename.toUpperCase() as TSecretName;
}

function initializeDockerSecrets() {
  try {
    secretsFiles = getAllSecretsFiles();
    validateSecretsCount(secretsFiles);

    for (const filename of secretsFiles) {
      const secretName = validateAndNormalizeSecretName(filename);
      const dockerSecret = getDockerSecret(filename);
      secrets[secretName] = dockerSecret;
    }
  } catch (error) {
    const exitMsg = error instanceof Error ? error.message : '[secrets.js] FAILURE: validation failed';
    abortServerInitialization(new Error(exitMsg));
  }
  console.log('[secrets.js] SUCCESS: docker secrets loaded');
}

export { initializeDockerSecrets, secrets };
