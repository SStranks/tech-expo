import type { TPostgresDB } from '#Config/dbPostgres';
import type { TTimeZoneTable } from '#Config/schema';

import { TimeZoneTable } from '#Config/schema';
import importCSVFile from '#Utils/importCsvFile';

import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const CSV = path.resolve(CUR, '../../data/Countries with UTC Offset.csv');

export default async function seedTimeZones(db: TPostgresDB) {
  const data = importCSVFile<TTimeZoneTable>(CSV);

  await db.insert(TimeZoneTable).values(data);

  console.log('Seed Successful: TimeZones.ts');
}
