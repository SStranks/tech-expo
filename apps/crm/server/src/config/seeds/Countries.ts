import type { TPostgresDB } from '#Config/dbPostgres';
import type { TCountriesTable } from '#Config/schema';

import { CountriesTable } from '#Config/schema';
import importCSVFile from '#Utils/importCsvFile';

import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const CSV = path.resolve(CUR, '../../data/Countries.csv');

export default async function seedCountries(db: TPostgresDB) {
  const data = importCSVFile<TCountriesTable>(CSV);

  await db.insert(CountriesTable).values(data);

  console.log('Seed Successful: Countries.ts');
}
