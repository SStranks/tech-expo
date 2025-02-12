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
  const countriesData = importCSVFile<TCountriesTableInsert>(countriesCSV);

  const countriesReturnData = await db
    .insert(CountriesTable)
    .values(countriesData)
    .returning({ id: CountriesTable.id, alpha2code: CountriesTable.alpha2Code });

  // ------ COUNTRIES-TIMEZONES ------ //
  type TTimeZonesCSV = Omit<TTimeZoneTableInsert, 'id' | 'countryId'>;
  interface ICountriesObj {
    [key: string]: UUID;
  }

  const timezones = importCSVFile<TTimeZonesCSV>(timeZoneCSV);
  const countriesObj = countriesReturnData.reduce((acc, cur) => {
    acc[cur.alpha2code] = cur.id;
    return acc;
  }, {} as ICountriesObj);

  const timezonesData = timezones.map((entry) => ({
    ...entry,
    countryId: countriesObj[`${entry.alpha2Code}`],
  }));

  await db.insert(TimeZoneTable).values(timezonesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Countries.ts, TimeZones.ts');
}
