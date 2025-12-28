import { reset } from 'drizzle-seed';
import { z, ZodError } from 'zod';

import { postgresClient, postgresDB } from './dbPostgres.js';
import schema from './schema/Schemas.js';
import { initializeDockerSecrets } from './secrets.js';
import Calendar from './seeds/Calendar.js';
import Companies from './seeds/Companies.js';
import CompaniesNotes from './seeds/CompaniesNotes.js';
import Contacts from './seeds/Contacts.js';
import ContactsNotes from './seeds/ContactsNotes.js';
import Countries from './seeds/Countries.js';
import Kanban from './seeds/Kanban.js';
import Pipeline from './seeds/Pipeline.js';
import Quotes from './seeds/Quotes.js';
import QuotesNotes from './seeds/QuotesNotes.js';
import QuotesServices from './seeds/QuotesServices.js';
import Users from './seeds/Users.js';

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
  await Countries(postgresDB);
  await Companies(postgresDB);
  console.log('Seeding relational data...');
  await Users(postgresDB);
  await CompaniesNotes(postgresDB);
  await Calendar(postgresDB);
  await Contacts(postgresDB);
  await ContactsNotes(postgresDB);
  await Quotes(postgresDB);
  await QuotesServices(postgresDB);
  await QuotesNotes(postgresDB);
  await Pipeline(postgresDB);
  await Kanban(postgresDB);
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
