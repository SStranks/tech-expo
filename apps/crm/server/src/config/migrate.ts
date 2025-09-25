import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import fs from 'node:fs';
import { createSecureContext } from 'node:tls';

const {
  NODE_ENV,
  POSTGRES_DATABASE: DATABASE,
  POSTGRES_DOCKER_PORT: PORT,
  POSTGRES_HOST: HOST,
  POSTGRES_PASSWORD: PASSWORD,
  POSTGRES_USER: USER,
} = process.env;
const POSTGRES_URL = `postgres://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;

console.log(POSTGRES_URL);

let secureContext;
try {
  secureContext = createSecureContext({
    ca: fs.readFileSync('/etc/expressjs/certs/expressjs-ca.crt'),
    cert: fs.readFileSync('/etc/expressjs/certs/expressjs-postgresseeder.crt'),
    key: fs.readFileSync('/etc/expressjs/certs/expressjs-postgresseeder.key'),
  });
  console.log('[dbPostgres] Secure context created');
} catch (error) {
  console.error('[dbPostgres] Failed to create secure context:', error);
}

const options: postgres.Options<Record<string, postgres.PostgresType>> = {
  debug: NODE_ENV === 'development',
  max: 1,
  ssl: {
    rejectUnauthorized: false,
    secureContext,
  },
};

const postgresClient = postgres(POSTGRES_URL, options);

try {
  await migrate(drizzle(postgresClient), { migrationsFolder: './src/config/migrations' });
} catch (error) {
  console.log(`Migration Error: ${error}`);
} finally {
  await postgresClient.end();
}
