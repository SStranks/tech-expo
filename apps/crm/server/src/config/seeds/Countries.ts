import type { PostgresClient } from '#Config/dbPostgres.ts';
import type { CountriesTableInsert } from '#Config/schema/Countries.ts';
import type { TimeZoneTableInsert } from '#Config/schema/TimeZones.ts';
import type { CountryId } from '#Models/domain/country/country.types.js';

import CountriesTable from '#Config/schema/Countries.js';
import TimeZoneTable from '#Config/schema/TimeZones.js';
import { asCountryId } from '#Models/domain/country/country.mapper.js';
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
  const countriesDict = countriesInsertReturnData.reduce<{ [key: string]: CountryId }>((acc, cur) => {
    acc[cur.alpha2code] = cur.id;
    return acc;
  }, {});

  // NOTE:  Countries can have more than one time-zone; separated tables for countries and time-zones.
  timeZonesCSVData.forEach((entry) => {
    const countryId = countriesDict[`${entry.alpha2Code}`];
    if (countryId === undefined) throw new Error(`seedCountries: countriesDict[${entry.alpha2Code}]`);

    timeZonesInsertionData.push({
      ...entry,
      countryId: asCountryId(countryId),
    });
  });

  await db.insert(TimeZoneTable).values(timeZonesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Countries.ts, TimeZones.ts');
}
