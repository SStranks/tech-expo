/// <reference types="node" />

import { defineConfig } from 'drizzle-kit';
import '@dotenvx/dotenvx/config';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/config/migrations',
  schema: './src/config/schema/*',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
});
