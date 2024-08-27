import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import DrizzleLogger from '#Lib/drizzleLogger';
import schema from '#Drizzle/schema';

// Migrations Client
const migrationClient = postgres(process.env.POSTGRES_URL as string, { max: 1 });

// Query Client
const queryClient = postgres(process.env.POSTGRES_URL as string);
const postgresDB = drizzle(queryClient, { schema, logger: new DrizzleLogger() });

export { migrationClient, postgresDB };
