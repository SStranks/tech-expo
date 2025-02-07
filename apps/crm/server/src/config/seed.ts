import { reset } from 'drizzle-seed';

import { postgresClient, postgresDB } from './dbPostgres';
import * as schema from './schema';
import * as seeds from './seeds';

if (process.env.DRIZZLE !== 'seed') throw new Error('DRIZZLE Environment Variable not set');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetDB = async () => {
  console.log('Clearing Database...');
  await reset(postgresDB, schema);
  console.log('Database cleared successfully.');
};

const seedDB = async () => {
  console.log('Seeding database...');
  // await seeds.Countries(postgresDB);
  // await seeds.Timezones(postgresDB);
  // await seeds.Companies(postgresDB);
  await seeds.Calendar(postgresDB);
  console.log('Database seeding completed.');
};

try {
  // await resetDB();
  await seedDB();
} catch (error) {
  console.log(`Error: ${error}`);
} finally {
  await postgresClient.end();
}
