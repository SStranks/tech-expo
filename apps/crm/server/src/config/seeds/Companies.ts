import type { TPostgresDB } from '#Config/dbPostgres';
import type { TCompaniesTable } from '#Config/schema';

import { eq } from 'drizzle-orm';

import { CompaniesTable, CountriesTable } from '#Config/schema';
import importCSVFile from '#Utils/importCsvFile';

import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const CSV = path.resolve(CUR, '../../data/TechCompanies_1.1.csv');

export default async function seedCompanies(db: TPostgresDB) {
  const companies = importCSVFile<TCompaniesTable>(CSV);
  const data = await Promise.all(
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

  await db.insert(CompaniesTable).values(data);

  console.log('Seed Successful: Companies.ts');
}
