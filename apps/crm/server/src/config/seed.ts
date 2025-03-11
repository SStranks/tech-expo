import { reset } from 'drizzle-seed';

import { postgresClient, postgresDB } from './dbPostgres.js';
import * as schema from './schema/index.js';
import * as seeds from './seeds/index.js';

if (process.env.DRIZZLE !== 'seed') throw new Error('DRIZZLE Environment Variable not set');

const resetDB = async () => {
  console.log('Clearing Database...');
  await reset(postgresDB, schema);
  console.log('Database cleared successfully.');
};

// TODO:  Could separate out the non-related and relational seeds; promise.allSettled and promise.all
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
