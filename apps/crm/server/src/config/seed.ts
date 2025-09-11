import { reset } from 'drizzle-seed';
import { z, ZodError } from 'zod';

import { postgresClient, postgresDB } from './dbPostgres.js';
import * as schema from './schema/index.js';
import { initializeDockerSecrets } from './secrets.js';
import * as seeds from './seeds/index.js';

initializeDockerSecrets();

const ENV_SCHEMA = z.object({
  DRIZZLE: z.literal('seed'),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_LOCAL_PORT: z.string().min(1),
});

try {
  ENV_SCHEMA.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.log('ENVIRONMENTAL VARIABLES', error);
  }
}

const resetDB = async () => {
  console.log('Clearing Database...');
  await reset(postgresDB, schema);
  console.log('Database cleared successfully.');
};

const seedDB = async () => {
  console.log('Seeding database...');
  console.log('Seeding non-relational data...');
  await seeds.Countries(postgresDB);
  await seeds.Companies(postgresDB);
  console.log('Seeding relational data...');
  await seeds.Users(postgresDB);
  await seeds.CompaniesNotes(postgresDB);
  await seeds.Calendar(postgresDB);
  await seeds.Contacts(postgresDB);
  await seeds.ContactsNotes(postgresDB);
  await seeds.Quotes(postgresDB);
  await seeds.QuotesServices(postgresDB);
  await seeds.QuotesNotes(postgresDB);
  await seeds.Pipeline(postgresDB);
  await seeds.Kanban(postgresDB);
  console.log('Database seeding completed.');
};

try {
  await resetDB();
  await seedDB();
} catch (error) {
  console.log(`Error: ${error}`);
} finally {
  await postgresClient.end();
}
