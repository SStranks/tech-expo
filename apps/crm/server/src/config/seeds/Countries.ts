import type { UUID } from '@apps/crm-shared';

import type { PostgresClient } from '#Config/dbPostgres.ts';
import type { CountriesTableInsert } from '#Config/schema/Countries.ts';
import type { TimeZoneTableInsert } from '#Config/schema/TimeZones.ts';

import CountriesTable from '#Config/schema/Countries.js';
import TimeZoneTable from '#Config/schema/TimeZones.js';
import { toDbUUID } from '#Helpers/helpers.js';
import importCSVFile from '#Utils/importCsvFile.js';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const COUNTRIES_CSV = path.resolve(__dirname, '../../data/Countries.csv');
const TIMEZONE_CSV = path.resolve(__dirname, '../../data/Countries with UTC Offset.csv');

export default async function seedCountries(db: PostgresClient) {
  // ----------- COUNTRIES TABLE ----------- //
  const countriesInsertionData: CountriesTableInsert[] = importCSVFile<CountriesTableInsert>(COUNTRIES_CSV);

  const countriesInsertReturnData = await db
    .insert(CountriesTable)
    .values(countriesInsertionData)
    .returning({ id: CountriesTable.id, alpha2code: CountriesTable.alpha2Code });

  // ------ COUNTRIES-TIMEZONES TABLE ------ //
  const timeZonesInsertionData: TimeZoneTableInsert[] = [];

  type TimeZonesCSV = Omit<TimeZoneTableInsert, 'id' | 'countryId'>;
  const timeZonesCSVData = importCSVFile<TimeZonesCSV>(TIMEZONE_CSV);

  // Create dictionary of alpha-2 codes and country IDs
  const countriesDict = countriesInsertReturnData.reduce(
    (acc, cur) => {
      acc[cur.alpha2code] = toDbUUID(cur.id);
      return acc;
    },
    {} as { [key: string]: UUID }
  );

  // NOTE:  Countries can have more than one time-zone; separated tables for countries and time-zones.
  timeZonesCSVData.forEach((entry) => {
    timeZonesInsertionData.push({
      ...entry,
      countryId: countriesDict[`${entry.alpha2Code}`],
    });
  });

  await db.insert(TimeZoneTable).values(timeZonesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Countries.ts, TimeZones.ts');
}
