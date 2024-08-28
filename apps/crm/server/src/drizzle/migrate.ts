import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

// Migrations Client
const migrationClient = postgres(process.env.POSTGRES_URL as string, { max: 1 });
await migrate(drizzle(migrationClient), { migrationsFolder: '../drizzle/migrations' });

await migrationClient.end();
