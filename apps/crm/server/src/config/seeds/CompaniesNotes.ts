import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TCompaniesNotesTableInsert, TCompaniesTableSelect } from '#Config/schema/index.js';

import { CompaniesNotesTable } from '#Config/schema/index.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateCompaniesNotes } from './generators/CompaniesNotes.js';

const { COMPANY_NAME } = seedSettings;

export type TCompaniesQueryCompaniesNotes = Pick<TCompaniesTableSelect, 'id' | 'companyName' | 'industry'>;

export default async function seedCompaniesNotes(db: TPostgresDB) {
  const allCompanies = await db.query.CompaniesTable.findMany({
    columns: { id: true, companyName: true, industry: true },
    where: (companies, { ne }) => ne(companies.companyName, COMPANY_NAME),
  });
  const allUsers = await db.query.UserProfileTable.findMany({ columns: { id: true, firstName: true } });

  // --------- COMPANY NOTES --------- //
  const companyNotesData: TCompaniesNotesTableInsert[] = [];

  allCompanies.forEach((company) => {
    const notes = generateCompaniesNotes(company, allUsers);
    companyNotesData.push(...notes);
  });

  await db.insert(CompaniesNotesTable).values(companyNotesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: CompaniesNotes.ts');
}
