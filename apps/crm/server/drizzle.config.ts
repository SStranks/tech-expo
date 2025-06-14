/// <reference types="node" />

import { defineConfig } from 'drizzle-kit';
import '@dotenvx/dotenvx/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/config/schema/*',
  out: './src/config/migrations',
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
  verbose: true,
  strict: true,
});
