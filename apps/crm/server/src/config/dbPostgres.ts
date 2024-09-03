import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import pinoLogger from '#Helpers/pinoLogger';
import rollbar from '#Helpers/rollbar';
import DrizzleLogger from '#Lib/drizzleLogger';
import * as schema from '#Drizzle/schema';

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_LOCAL_PORT, POSTGRES_DB } = process.env;
const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_LOCAL_PORT}/${POSTGRES_DB}`;
pinoLogger.debug(POSTGRES_URL);

// Query Client
const options = {
  debug: process.env.NODE_ENV === 'development',
};
const postgresClient = postgres(POSTGRES_URL, options);
const postgresDB = drizzle(postgresClient, { schema, logger: new DrizzleLogger() });

// Connection Test
const connectPostgresDB = async () => {
  try {
    await postgresClient`SELECT 1`;
  } catch (error) {
    const errMsg = `Cannot connect to Postgres: ${POSTGRES_HOST}:${POSTGRES_LOCAL_PORT}/${POSTGRES_DB}`;
    process.exitCode = 1;

    pinoLogger.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
  pinoLogger.info(`Connected to Postgres: ${POSTGRES_HOST}:${POSTGRES_LOCAL_PORT}/${POSTGRES_DB}`);
};

export { connectPostgresDB, postgresClient, postgresDB };
