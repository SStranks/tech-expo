import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '#Config/schema/index';
import { pinoLogger, rollbar } from '#Helpers/index';
import DrizzleLogger from '#Lib/drizzleLogger';

const { POSTGRES_DB, POSTGRES_HOST, POSTGRES_LOCAL_PORT, POSTGRES_PASSWORD, POSTGRES_USER } = process.env;
const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_LOCAL_PORT}/${POSTGRES_DB}`;

// DANGER:  Ensure logger for current ENV is not storing credentials; level INFO or higher.
pinoLogger.debug(POSTGRES_URL);

// Query Client
const options = {
  debug: process.env.NODE_ENV === 'development',
};
const postgresClient = postgres(POSTGRES_URL, options);
const postgresDB = drizzle(postgresClient, { logger: new DrizzleLogger(), schema });

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
