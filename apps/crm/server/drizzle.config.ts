import { defineConfig } from 'drizzle-kit';
import '@dotenvx/dotenvx/config';

import { initializeDockerSecrets, secrets } from './src/config/secrets.ts';

initializeDockerSecrets();
const { POSTGRES_URL } = secrets;

export default defineConfig({
  dialect: 'postgresql',
  out: './src/config/migrations',
  schema: './src/config/schema/*',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: POSTGRES_URL,
  },
});
