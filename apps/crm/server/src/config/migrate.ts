import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { postgresClient } from './dbPostgres.js';

await migrate(drizzle(postgresClient), { migrationsFolder: './src/config/migrations' });
await postgresClient.end();
