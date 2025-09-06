import { z, ZodError } from 'zod';

if (process.env.NODE_ENV === undefined) throw new Error('NODE_ENV not set');

const envSchemaProd = z.object({
  EXPRESS_DOCKER_PORT: z.string().min(1).optional(),
  EXPRESS_LOCAL_PORT: z.string().min(1),
  JWT_AUTH_EXPIRES: z.string().min(1),
  JWT_AUTH_SECRET: z.string().min(1),
  JWT_COOKIE_AUTH_EXPIRES: z.string().min(1),
  JWT_COOKIE_AUTH_ID: z.string().min(1),
  JWT_COOKIE_REFRESH_EXPIRES: z.string().min(1),
  JWT_COOKIE_REFRESH_ID: z.string().min(1),
  JWT_REFRESH_EXPIRES: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  MONGO_ARGS: z.string().min(1),
  MONGO_DATABASE: z.string().min(1),
  MONGO_DOCKER_PORT: z.string().min(1),
  MONGO_HOST: z.string().min(1),
  MONGO_PASSWORD: z.string().min(1),
  MONGO_PROTOCOL: z.string().min(1),
  MONGO_USER: z.string().min(1),
  NODE_ENV: z.string().min(1),
  NODEMAILER_DEV_EMAIL: z.string().min(1),
  NODEMAILER_HOST: z.string().min(1),
  NODEMAILER_PASSWORD: z.string().min(1),
  NODEMAILER_PORT: z.string().min(1),
  NODEMAILER_SECURE: z.literal(['true', 'false']),
  NODEMAILER_USERNAME: z.string().min(1),
  PASSWORD_RESET_EXPIRES: z.string().min(1),
  PINO_LOG_LEVEL: z.string().min(1),
  POSTGRES_DATABASE: z.string().min(1),
  POSTGRES_DOCKER_PORT: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_PEPPER: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  REDIS_DOCKER_PORT: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
  REDIS_USERNAME: z.string().min(1),
  ROLLBAR_ENABLED: z.string().min(1),
  ROLLBAR_POST_SERVER_ITEM: z.string().min(1),
});

// TODO:  Add in all DEV envs; check PROD object is just prod envs.
// TODO:  Migrate sensitive secrets from ENVs to runtime secret extraction
const envSchemaDev = z.object({
  DEMO_ACC_GENERIC_NON_USER_PASSWORD: z.string().min(1),
  EXPRESS_DOCKER_PORT: z.string().min(1).optional(),
  EXPRESS_LOCAL_PORT: z.string().min(1),
  GRAPHQL_INTROSPECT_AUTH: z.string().min(1),
  JWT_AUTH_EXPIRES: z.string().min(1),
  JWT_AUTH_SECRET: z.string().min(1),
  JWT_COOKIE_AUTH_EXPIRES: z.string().min(1),
  JWT_COOKIE_AUTH_ID: z.string().min(1),
  JWT_COOKIE_REFRESH_EXPIRES: z.string().min(1),
  JWT_COOKIE_REFRESH_ID: z.string().min(1),
  JWT_REFRESH_EXPIRES: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  MONGO_ARGS: z.string().min(1),
  MONGO_DATABASE: z.string().min(1),
  MONGO_DOCKER_PORT: z.string().min(1),
  MONGO_HOST: z.string().min(1),
  MONGO_PASSWORD: z.string().min(1),
  MONGO_PROTOCOL: z.string().min(1),
  MONGO_USER: z.string().min(1),
  NODE_ENV: z.string().min(1),
  NODEMAILER_DEV_EMAIL: z.string().min(1),
  NODEMAILER_HOST: z.string().min(1),
  NODEMAILER_PASSWORD: z.string().min(1),
  NODEMAILER_PORT: z.string().min(1),
  NODEMAILER_SECURE: z.literal(['true', 'false']),
  NODEMAILER_USERNAME: z.string().min(1),
  PASSWORD_RESET_EXPIRES: z.string().min(1),
  PINO_LOG_LEVEL: z.string().min(1),
  POSTGRES_DATABASE: z.string().min(1),
  POSTGRES_DOCKER_PORT: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_PEPPER: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  REDIS_DOCKER_PORT: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
  REDIS_USERNAME: z.string().min(1),
  ROLLBAR_ENABLED: z.string().min(1),
  ROLLBAR_POST_SERVER_ITEM: z.string().min(1),
});

const validateEnvironmentVariables = () => {
  try {
    process.env.NODE_ENV === 'prod' ? envSchemaProd.parse(process.env) : envSchemaDev.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log('ENVIRONMENTAL VARIABLES', error);
      process.kill(process.pid, 'SIGINT');
    }
  }
};

export default validateEnvironmentVariables;
