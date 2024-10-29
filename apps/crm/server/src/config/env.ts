import { z, ZodError } from 'zod';

const envSchema = z.object({
  JWT_AUTH_EXPIRES: z.string().min(1),
  JWT_AUTH_SECRET: z.string().min(1),
  JWT_COOKIE_AUTH_EXPIRES: z.string().min(1),
  JWT_COOKIE_AUTH_ID: z.string().min(1),
  JWT_COOKIE_REFRESH_EXPIRES: z.string().min(1),
  JWT_COOKIE_REFRESH_ID: z.string().min(1),
  JWT_REFRESH_EXPIRES: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  MONGODB_ARGS: z.string().min(1),
  MONGODB_DATABASE: z.string().min(1),
  MONGODB_HOST: z.string().min(1),
  MONGODB_PASSWORD: z.string().min(1),
  MONGODB_PORT: z.string().min(1),
  MONGODB_PROTOCOL: z.string().min(1),
  MONGODB_USER: z.string().min(1),
  NODE_DOCKER_PORT: z.string().min(1).optional(),
  NODE_ENV: z.string().min(1),
  NODE_LOCAL_PORT: z.string().min(1),
  NODEMAILER_DEV_EMAIL: z.string().min(1),
  NODEMAILER_HOST: z.string().min(1),
  NODEMAILER_PASSWORD: z.string().min(1),
  NODEMAILER_PORT: z.string().min(1),
  NODEMAILER_USERNAME: z.string().min(1),
  PASSWORD_RESET_EXPIRES: z.string().min(1),
  PINO_LOG_LEVEL: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_LOCAL_PORT: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_PEPPER: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_LOCAL_PORT: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
  REDIS_USERNAME: z.string().min(1),
  ROLLBAR_ENABLED: z.string().min(1),
  ROLLBAR_POST_SERVER_ITEM: z.string().min(1),
});

const validateEnvironmentVariables = () => {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log('ENVIRONMENTAL VARIABLES', error);
      process.kill(process.pid, 'SIGINT');
    }
  }
};

export default validateEnvironmentVariables;
