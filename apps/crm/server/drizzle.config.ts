import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

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
