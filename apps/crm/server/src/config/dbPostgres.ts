import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '#Config/schema/index.js';
import { DrizzleLogger, pinoLogger, rollbar } from '#Lib/index.js';
import { AppError, PostgresError } from '#Utils/errors/index.js';

const { DRIZZLE, NODE_ENV, POSTGRES_DATABASE, POSTGRES_HOST, POSTGRES_LOCAL_PORT, POSTGRES_PASSWORD, POSTGRES_USER } =
  process.env;
const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_LOCAL_PORT}/${POSTGRES_DATABASE}`;

// DANGER:  Ensure logger for current ENV is not storing credentials; level INFO or higher.
pinoLogger.debug(POSTGRES_URL);

// Query Client
const options: postgres.Options<Record<string, postgres.PostgresType>> = {
  debug: NODE_ENV === 'development',
  max: DRIZZLE === 'migrate' || DRIZZLE === 'seed' ? 1 : undefined,
};
const logger = DRIZZLE === 'migrate' || DRIZZLE === 'seed' ? false : new DrizzleLogger();

const postgresClient = postgres(POSTGRES_URL, options);
const postgresDB = drizzle(postgresClient, { logger, schema });

// Connection Test
const connectPostgresDB = async () => {
  try {
    await postgresClient`SELECT 1`;
  } catch (error) {
    const errMsg = `Cannot connect to Postgres: ${POSTGRES_HOST}:${POSTGRES_LOCAL_PORT}/${POSTGRES_DATABASE}`;
    process.exitCode = 1;

    pinoLogger.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
  pinoLogger.info(`Connected to Postgres: ${POSTGRES_HOST}:${POSTGRES_LOCAL_PORT}/${POSTGRES_DATABASE}`);
};

type TPostgresHTTPError = { httpCode: number; message: string };
const errorCodesMap: Record<string, TPostgresHTTPError> = {
  '08': { httpCode: 503, message: 'pg connection err' },
  '09': { httpCode: 500, message: 'triggered action exception' },
  '0L': { httpCode: 403, message: 'invalid grantor' },
  '0P': { httpCode: 403, message: 'invalid role specification' },
  '23503': { httpCode: 409, message: 'foreign key violation' },
  '23505': { httpCode: 409, message: 'uniqueness violation' },
  '25': { httpCode: 500, message: 'invalid transaction state' },
  '25006': { httpCode: 405, message: 'read only sql transaction' },
  '28': { httpCode: 403, message: 'invalid auth specification' },
  '2D': { httpCode: 500, message: 'invalid transaction termination' },
  '38': { httpCode: 500, message: 'external routine exception' },
  '39': { httpCode: 500, message: 'external routine invocation' },
  '3B': { httpCode: 500, message: 'savepoint exception' },
  '40': { httpCode: 500, message: 'transaction rollback' },
  '42501': { httpCode: 403, message: 'insufficient privileges' },
  '42883': { httpCode: 404, message: 'undefined function' },
  '42P01': { httpCode: 404, message: 'undefined table' },
  '42P17': { httpCode: 500, message: 'infinite recursion' },
  '53': { httpCode: 503, message: 'insufficient resources' },
  '53400': { httpCode: 500, message: 'config limit exceeded' },
  '54': { httpCode: 500, message: 'too complex' },
  '55': { httpCode: 500, message: 'obj not in prerequisite state' },
  '57': { httpCode: 500, message: 'operator intervention' },
  '58': { httpCode: 500, message: 'system error' },
  F0: { httpCode: 500, message: 'config file error' },
  HV: { httpCode: 500, message: 'foreign data wrapper error' },
  other: { httpCode: 400, message: 'unknown' },
  P0: { httpCode: 500, message: 'PL/pgSQL error' },
  P0001: { httpCode: 400, message: 'default code for “raise”' },
  XX: { httpCode: 500, message: 'internal error' },
};

// Postgres Error to HTTP
// Based on https://docs.postgrest.org/en/stable/references/errors.html#http-status-codes
const postgresErrorHTTPMapper = (errorCode: string): TPostgresHTTPError => {
  // Specific 5-digit codes
  if (errorCode in errorCodesMap) {
    // eslint-disable-next-line security/detect-object-injection
    return errorCodesMap[errorCode];
  }

  // Multiple codes based on first 2 tokens
  const errorCodeStartWith = errorCode.slice(0, 2);
  if (errorCodeStartWith in errorCodesMap) {
    // eslint-disable-next-line security/detect-object-injection
    return errorCodesMap[errorCodeStartWith];
  }

  return { httpCode: 400, message: 'unknown' };
};

const postgresDBCall = async <T>(dbCall: () => Promise<T>): Promise<T> => {
  try {
    return await dbCall();
  } catch (error: unknown) {
    if (error instanceof postgres.PostgresError) {
      const { httpCode, message } = postgresErrorHTTPMapper(error.code);
      throw new PostgresError({ code: httpCode, logging: httpCode >= 500, message });
    }
    throw new AppError({ context: { error }, logging: true });
  }
};

export type TPostgresDB = typeof postgresDB;
export { connectPostgresDB, postgresClient, postgresDB, postgresDBCall, postgresErrorHTTPMapper };
