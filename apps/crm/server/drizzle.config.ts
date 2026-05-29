import '@dotenvx/dotenvx/config';

import { defineConfig } from 'drizzle-kit';

import { initializeDockerSecrets, secrets } from './src/config/secrets.js';

initializeDockerSecrets();
const { POSTGRES_URL } = secrets;

export default defineConfig({
  dbCredentials: {
    url: POSTGRES_URL,
  },
  dialect: 'postgresql',
  out: './src/config/migrations',
  schema: './src/config/schema/*',
  strict: true,
  verbose: true,
});
