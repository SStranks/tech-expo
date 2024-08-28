import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import DrizzleLogger from '#Lib/drizzleLogger';
import * as schema from '#Drizzle/schema';

// Query Client
const queryClient = postgres(process.env.POSTGRES_URL as string);
const postgresDB = drizzle(queryClient, { schema, logger: new DrizzleLogger() });

export default postgresDB;
