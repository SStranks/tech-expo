import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { postgresClient } from './dbPostgres.js';

try {
  await migrate(drizzle(postgresClient), { migrationsFolder: './src/config/migrations' });
} catch (error) {
  console.log(`Migration Error: ${error}`);
} finally {
  await postgresClient.end();
}
