import type { UUID } from 'node:crypto';

import type { TPostgresDB } from '#Config/dbPostgres.ts';
import type { TCountriesTableInsert, TTimeZoneTableInsert } from '#Config/schema/index.ts';

import { CountriesTable, TimeZoneTable } from '#Config/schema/index.js';
import importCSVFile from '#Utils/importCsvFile.js';

import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const countriesCSV = path.resolve(CUR, '../../data/Countries.csv');
const timeZoneCSV = path.resolve(CUR, '../../data/Countries with UTC Offset.csv');

export default async function seedCountries(db: TPostgresDB) {
  // ----------- COUNTRIES ----------- //
  const countriesInsertionData: TCountriesTableInsert[] = importCSVFile<TCountriesTableInsert>(countriesCSV);

  const countriesInsertReturnData = await db
    .insert(CountriesTable)
    .values(countriesInsertionData)
    .returning({ id: CountriesTable.id, alpha2code: CountriesTable.alpha2Code });

  // ------ COUNTRIES-TIMEZONES ------ //
  const timeZonesInsertionData: TTimeZoneTableInsert[] = [];

  type TTimeZonesCSV = Omit<TTimeZoneTableInsert, 'id' | 'countryId'>;
  const timeZonesCSVData = importCSVFile<TTimeZonesCSV>(timeZoneCSV);

  // Create dictionary of alpha-2 codes and country IDs
  const countriesDict = countriesInsertReturnData.reduce(
    (acc, cur) => {
      acc[cur.alpha2code] = cur.id;
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
