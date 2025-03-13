import type { TPostgresDB } from '#Config/dbPostgres.ts';
import type { TCompaniesTableInsert } from '#Config/schema/index.ts';

import { CompaniesTable } from '#Config/schema/index.js';
import importCSVFile from '#Utils/importCsvFile.js';

import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const CSV = path.resolve(CUR, '../../data/TechCompanies_1.1.csv');

export default async function seedCompanies(db: TPostgresDB) {
  // ----------- COMPANIES ----------- //
  const companiesData: TCompaniesTableInsert[] = [];
  const companiesCSVData = importCSVFile<TCompaniesTableInsert>(CSV);
  const getAllCountries = await db.query.CountriesTable.findMany({ columns: { id: true, alpha2Code: true } });

  // Append the CSV data with the applicable country UUID from DB
  companiesCSVData.forEach((company) => {
    const country = getAllCountries.find((country) => country.alpha2Code === company.country);
    if (!country) throw new Error('Error: Could not locate country from company');
    companiesData.push({ ...company, country: country.id });
  });

  await db.insert(CompaniesTable).values(companiesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Companies.ts');
}
