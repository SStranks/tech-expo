import type { TPostgresDB } from '#Config/dbPostgres.ts';
import type { TCompaniesTableInsert } from '#Config/schema/index.ts';

import { eq } from 'drizzle-orm';

import { CompaniesTable, CountriesTable } from '#Config/schema/index.js';
import importCSVFile from '#Utils/importCsvFile.js';

import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const CSV = path.resolve(CUR, '../../data/TechCompanies_1.1.csv');

export default async function seedCompanies(db: TPostgresDB) {
  // ----------- COMPANIES ----------- //
  const companies = importCSVFile<TCompaniesTableInsert>(CSV);
  const companiesData = await Promise.all(
    companies.map(async (company) => {
      const country = await db.query.CountriesTable.findFirst({
        columns: { id: true },
        where: eq(CountriesTable.alpha2Code, company.country),
      });

      if (!country) throw new Error('Error: Could not locate country from company');

      return {
        ...company,
        country: country.id,
      };
    })
  );

  await db.insert(CompaniesTable).values(companiesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Companies.ts');
}
