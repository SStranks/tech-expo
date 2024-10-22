import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_LOCAL_PORT, POSTGRES_DB } = process.env;
const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_LOCAL_PORT}/${POSTGRES_DB}`;

// Migrations Client
const migrationClient = postgres(POSTGRES_URL, { max: 1 });
await migrate(drizzle(migrationClient), { migrationsFolder: './src/config/migrations' });

await migrationClient.end();
