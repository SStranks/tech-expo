/* eslint-disable perfectionist/sort-objects */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import schema from '#Config/schema/Schemas.js';
import DrizzleLogger from '#Lib/drizzleLogger.js';
import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';
import AppError from '#Utils/errors/AppError.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import fs from 'node:fs';
import { createSecureContext } from 'node:tls';

import { secrets } from './secrets.js';

const { POSTGRES_DATABASE: DATABASE, POSTGRES_PASSWORD_SERVICE: PASSWORD, POSTGRES_USER_SERVICE: USER } = secrets;
const { DRIZZLE, NODE_ENV, POSTGRES_DOCKER_PORT: PORT, POSTGRES_HOST: HOST } = process.env;
const POSTGRES_URL = `postgres://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;

// DANGER:  Ensure logger for current ENV is not storing credentials; level INFO or higher.
pinoLogger.server.debug(POSTGRES_URL);

let secureContext;
try {
  secureContext = createSecureContext({
    ca: fs.readFileSync('/etc/expressjs/certs/expressjs-ca.crt'),
    cert: fs.readFileSync('/etc/expressjs/certs/expressjs-postgres.crt'),
    key: fs.readFileSync('/etc/expressjs/certs/expressjs-postgres.key'),
  });
  console.log('[dbPostgres] Secure context created');
} catch (error) {
  console.error('[dbPostgres] Failed to create secure context:', error);
}

// Query Client
const options: postgres.Options<Record<string, postgres.PostgresType>> = {
  debug: NODE_ENV === 'development',
  max: DRIZZLE === 'migrate' || DRIZZLE === 'seed' ? 1 : undefined,
  ssl: {
    rejectUnauthorized: true,
    secureContext,
  },
};
const logger = DRIZZLE === 'migrate' || DRIZZLE === 'seed' ? false : new DrizzleLogger();

const postgresClient = postgres(POSTGRES_URL, options);
const postgresDB = drizzle(postgresClient, { logger, schema });

// Connection Test
const connectPostgresDB = async () => {
  try {
    await postgresClient`SELECT 1`;
  } catch (error) {
    const errMsg = `Cannot connect to Postgres: ${HOST}:${PORT}/${DATABASE}`;
    process.exitCode = 1;

    pinoLogger.server.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
  pinoLogger.server.info(`Connected to Postgres: ${HOST}:${PORT}/${DATABASE}`);
};

export type DbErrorKind =
  | 'CONNECTION_FAILURE'
  | 'AUTHORIZATION_ERROR'
  | 'CONSTRAINT_VIOLATION'
  | 'NOT_FOUND'
  | 'INVALID_STATE'
  | 'TRANSIENT_FAILURE'
  | 'CONFIG_ERROR'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN';

export interface PostgresDomainError {
  kind: DbErrorKind;
  message: string;
  httpCode: number;
}

const kindToHttp: Record<DbErrorKind, number> = {
  CONNECTION_FAILURE: 503,
  AUTHORIZATION_ERROR: 403,
  CONSTRAINT_VIOLATION: 409,
  NOT_FOUND: 404,
  INVALID_STATE: 400,
  TRANSIENT_FAILURE: 503,
  CONFIG_ERROR: 500,
  INTERNAL_ERROR: 500,
  UNKNOWN: 500,
};

export const postgresKindToHttp = (kind: DbErrorKind): number => {
  return kindToHttp[`${kind}`];
};

const errorCodesMap: Record<string, PostgresDomainError> = {
  // Connection / availability
  '08': { httpCode: 503, kind: 'CONNECTION_FAILURE', message: 'Postgres connection error' },
  '53': { httpCode: 500, kind: 'TRANSIENT_FAILURE', message: 'Insufficient resources' },
  // Authorization / security
  '0L': { httpCode: 403, kind: 'AUTHORIZATION_ERROR', message: 'Invalid grantor' },
  '0P': { httpCode: 403, kind: 'AUTHORIZATION_ERROR', message: 'Invalid role specification' },
  '28': { httpCode: 403, kind: 'AUTHORIZATION_ERROR', message: 'Invalid authorization specification' },
  '42501': { httpCode: 403, kind: 'AUTHORIZATION_ERROR', message: 'Insufficient privileges' },
  // Constraints / integrity
  '23503': { httpCode: 409, kind: 'CONSTRAINT_VIOLATION', message: 'Foreign key violation' },
  '23505': { httpCode: 409, kind: 'CONSTRAINT_VIOLATION', message: 'Uniqueness violation' },
  // Missing objects
  '42P01': { httpCode: 404, kind: 'NOT_FOUND', message: 'Undefined table' },
  '42883': { httpCode: 404, kind: 'NOT_FOUND', message: 'Undefined function' },
  // Invalid state / usage
  '09': { httpCode: 500, kind: 'INVALID_STATE', message: 'Triggered action exception' },
  '25': { httpCode: 500, kind: 'INVALID_STATE', message: 'Invalid transaction state' },
  '25006': { httpCode: 405, kind: 'INVALID_STATE', message: 'Read-only SQL transaction' },
  '2D': { httpCode: 500, kind: 'INVALID_STATE', message: 'Invalid transaction termination' },
  '3B': { httpCode: 500, kind: 'INVALID_STATE', message: 'Savepoint exception' },
  // External / config
  F0: { httpCode: 500, kind: 'CONFIG_ERROR', message: 'Configuration file error' },
  HV: { httpCode: 500, kind: 'CONFIG_ERROR', message: 'Foreign data wrapper error' },
  P0: { httpCode: 500, kind: 'CONFIG_ERROR', message: 'PL/pgSQL error' },
  P0001: { httpCode: 400, kind: 'INVALID_STATE', message: 'RAISE exception' },
  // System / internal
  '38': { httpCode: 500, kind: 'INTERNAL_ERROR', message: 'External routine exception' },
  '39': { httpCode: 500, kind: 'INTERNAL_ERROR', message: 'External routine invocation exception' },
  '54': { httpCode: 500, kind: 'INTERNAL_ERROR', message: 'Program limit exceeded' },
  '55': { httpCode: 500, kind: 'INTERNAL_ERROR', message: 'Object not in prerequisite state' },
  '57': { httpCode: 500, kind: 'INTERNAL_ERROR', message: 'Operator intervention' },
  '58': { httpCode: 500, kind: 'INTERNAL_ERROR', message: 'System error' },
  XX: { httpCode: 500, kind: 'INTERNAL_ERROR', message: 'Internal Postgres error' },
  // Fallback
  other: { httpCode: 400, kind: 'UNKNOWN', message: 'Unknown Postgres error' },
};

export function postgresErrorDomainMapper(sqlState?: string): PostgresDomainError {
  if (!sqlState) return errorCodesMap.other;

  // eslint-disable-next-line security/detect-object-injection
  return errorCodesMap[sqlState] || errorCodesMap[sqlState.slice(0, 2)] || errorCodesMap.other;
}

// Postgres Error to HTTP
// Based on https://docs.postgrest.org/en/stable/references/errors.html#http-status-codes
const postgresErrorHTTPMapper = (errorCode: string): number => {
  // Specific 5-digit codes
  if (errorCode in errorCodesMap) {
    // eslint-disable-next-line security/detect-object-injection
    return errorCodesMap[errorCode].httpCode;
  }

  // Multiple codes based on first 2 tokens
  const errorCodeStartWith = errorCode.slice(0, 2);
  if (errorCodeStartWith in errorCodesMap) {
    // eslint-disable-next-line security/detect-object-injection
    return errorCodesMap[errorCodeStartWith].httpCode;
  }

  return 400;
};

const postgresDBCall = async <T>(dbCall: () => Promise<T>): Promise<T> => {
  try {
    return await dbCall();
  } catch (error: unknown) {
    if (error instanceof postgres.PostgresError) {
      const { httpCode, kind, message } = postgresErrorDomainMapper(error.code);
      throw new PostgresError({
        kind,
        message,
        logging: kind === 'INTERNAL_ERROR' || kind === 'TRANSIENT_FAILURE',
        context: { sqlState: error.code, httpCode },
      });
    }

    throw new AppError({
      httpStatus: 500,
      code: 'UNKNOWN_ERROR',
      context: { error },
      logging: true,
      message: 'Unknown Postgres error',
    });
  }
};

export type PostgresClient = typeof postgresDB;
export { connectPostgresDB, postgresClient, postgresDB, postgresDBCall, postgresErrorHTTPMapper };
