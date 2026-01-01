import type { PostgresClient } from '#Config/dbPostgres.ts';
import type { CompaniesTableInsert } from '#Config/schema/companies/Companies.ts';

import CompaniesTable from '#Config/schema/companies/Companies.js';
import importCSVFile from '#Utils/importCsvFile.js';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const COMPANIES_CSV = path.resolve(__dirname, '../../data/TechCompanies_1.2.csv');

export default async function seedCompanies(db: PostgresClient) {
  // ----------- COMPANIES TABLE ----------- //
  const companiesData: CompaniesTableInsert[] = [];
  const companiesCSVData = importCSVFile<CompaniesTableInsert>(COMPANIES_CSV);

  const allCountries = await db.query.CountriesTable.findMany({ columns: { id: true, alpha2Code: true } });
  if (!allCountries) throw new Error('Countries table returned no entries');

  // Append the CSV data with the applicable country UUID from DB
  companiesCSVData.forEach((company) => {
    const country = allCountries.find((country) => country.alpha2Code === company.country);
    if (!country) throw new Error('Could not locate country from company');
    companiesData.push({ ...company, country: country.id });
  });

  await db.insert(CompaniesTable).values(companiesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Companies.ts');
}
