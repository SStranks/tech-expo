/* eslint-disable unicorn/no-process-exit */
/* eslint-disable n/no-process-exit */
/* eslint-disable security/detect-object-injection */
import { z, ZodError } from 'zod';

import { msString } from '#Utils/zod/msString.js';

const { NODE_ENV } = process.env;
const VALID_ENVIRONMENTS = ['development', 'production', 'test'] as const;

// NOTE: See src/types/env.d.ts - ensure validation object keys match defined types
// DANGER: Non-senstitive configuration values only; secrets parsed in ./secrets.ts
const envSchemaProduction = z.object({
  EXPRESS_DOCKER_PORT: z.string().min(1).optional(),
  EXPRESS_LOCAL_PORT: z.string().min(1),
  JWT_AUTH_EXPIRES: msString(),
  JWT_COOKIE_AUTH_EXPIRES: msString(),
  JWT_COOKIE_AUTH_ID: msString(),
  JWT_COOKIE_REFRESH_EXPIRES: msString(),
  JWT_COOKIE_REFRESH_ID: msString(),
  JWT_REFRESH_EXPIRES: msString(),
  MONGO_ARGS: z.string().min(1),
  MONGO_DOCKER_PORT: z.string().min(1),
  MONGO_HOST: z.string().min(1),
  MONGO_PROTOCOL: z.string().min(1),
  NODE_ENV: z.string().min(1),
  NODEMAILER_HOST: z.string().min(1),
  NODEMAILER_PORT: z.string().min(1),
  NODEMAILER_SECURE: z.literal(['true', 'false']),
  PASSWORD_RESET_EXPIRES: z.string().min(1),
  PINO_LOG_LEVEL_PROD: z.string().min(1),
  POSTGRES_DOCKER_PORT: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  REDIS_DOCKER_PORT: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  ROLLBAR_ENABLED: z.string().min(1),
  ROLLBAR_POST_SERVER_ITEM: z.string().min(1),
});

const envSchemaDevelopment = z.object({
  EXPRESS_DOCKER_PORT: z.string().min(1).optional(),
  EXPRESS_LOCAL_PORT: z.string().min(1),
  JWT_AUTH_EXPIRES: msString(),
  JWT_COOKIE_AUTH_EXPIRES: msString(),
  JWT_COOKIE_AUTH_ID: msString(),
  JWT_COOKIE_REFRESH_EXPIRES: msString(),
  JWT_COOKIE_REFRESH_ID: msString(),
  JWT_REFRESH_EXPIRES: msString(),
  MONGO_ARGS: z.string().min(1),
  MONGO_DOCKER_PORT: z.string().min(1),
  MONGO_HOST: z.string().min(1),
  MONGO_PROTOCOL: z.string().min(1),
  NODE_ENV: z.string().min(1),
  NODEMAILER_HOST: z.string().min(1),
  NODEMAILER_PORT: z.string().min(1),
  NODEMAILER_SECURE: z.literal(['true', 'false']),
  PASSWORD_RESET_EXPIRES: z.string().min(1),
  PINO_LOG_LEVEL: z.string().min(1),
  POSTGRES_DOCKER_PORT: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  REDIS_DOCKER_PORT: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  ROLLBAR_ENABLED: z.string().min(1),
  ROLLBAR_POST_SERVER_ITEM: z.string().min(1),
});

const envSchemaTesting = z.object({
  JWT_AUTH_EXPIRES: msString(),
  JWT_COOKIE_AUTH_EXPIRES: msString(),
  JWT_COOKIE_AUTH_ID: msString(),
  JWT_COOKIE_REFRESH_EXPIRES: msString(),
  JWT_COOKIE_REFRESH_ID: msString(),
  JWT_REFRESH_EXPIRES: msString(),
  NODE_ENV: z.string().min(1),
  PASSWORD_RESET_EXPIRES: z.string().min(1),
  PINO_LOG_LEVEL: z.string().min(1),
  ROLLBAR_ENABLED: z.string().min(1),
});

const envSchemas = {
  development: envSchemaDevelopment,
  production: envSchemaProduction,
  test: envSchemaTesting,
} as const;

function validateNodeEnvironment() {
  if (typeof NODE_ENV !== 'string') throw new Error('[env.js] FAILURE: NODE_ENV is empty string');
  if (!(VALID_ENVIRONMENTS as readonly string[]).includes(NODE_ENV))
    throw new Error('[env.js] FAILURE: NODE_ENV is invalid');
  return NODE_ENV as (typeof VALID_ENVIRONMENTS)[number];
}

function validateEnvironmentVariables() {
  try {
    const nodeEnvironment = validateNodeEnvironment();
    const zodSchema = envSchemas[nodeEnvironment];
    zodSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(`[env.js] FAILURE: zod validation of schema for ${NODE_ENV} environment failed`, error);
      process.exit(1);
    }
    if (error instanceof Error) {
      console.log(`${error.message}`, error);
      process.exit(1);
    }
  }
  console.log(`[env.js] SUCCESS: environment variables loaded`);
}

type InferDev = z.infer<typeof envSchemaDevelopment>;
type InferProd = z.infer<typeof envSchemaProduction>;
type InferTest = z.infer<typeof envSchemaTesting>;

type CommonUnion = keyof InferDev & keyof InferProd & keyof InferTest;
type EnvCommon = Pick<InferDev & InferProd & InferTest, CommonUnion>;
type EnvUnique = Partial<Omit<InferDev & InferProd & InferTest, CommonUnion>>;
type Env = EnvCommon & EnvUnique;

const nodeEnvironment = validateNodeEnvironment();
const zodSchema = envSchemas[nodeEnvironment];

let envCache: Env | null;
const env = () => {
  if (!envCache) envCache = Object.freeze(zodSchema.parse(process.env));
  return envCache;
};

export { env, validateEnvironmentVariables };
