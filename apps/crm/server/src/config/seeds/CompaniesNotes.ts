import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TCompaniesNotesTableInsert, TCompaniesTableSelect } from '#Config/schema/index.js';

import { CompaniesNotesTable } from '#Config/schema/index.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateCompaniesNotes } from './generators/CompaniesNotes.js';

const { COMPANY_NAME } = seedSettings;

export type TCompaniesQueryCompaniesNotes = Pick<TCompaniesTableSelect, 'id' | 'companyName' | 'industry'>;
export type TSeedCompaniesNotesAllUsers = Awaited<ReturnType<typeof getAllUsers>>[number];

const getAllUsers = async (db: TPostgresDB) => {
  return await db.query.UserProfileTable.findMany({ columns: { id: true, firstName: true } });
};

export default async function seedCompaniesNotes(db: TPostgresDB) {
  const allCompanies = await db.query.CompaniesTable.findMany({
    columns: { id: true, companyName: true, industry: true },
    where: (companies, { ne }) => ne(companies.companyName, COMPANY_NAME),
  });
  if (!allCompanies) throw new Error('Users table returned no entries');

  const allUsers = await getAllUsers(db);
  if (!allUsers) throw new Error('Users table returned no entries');

  // --------- COMPANY NOTES TABLE --------- //
  const companyNotesInsertionData: TCompaniesNotesTableInsert[] = [];

  allCompanies.forEach((company) => {
    const notes = generateCompaniesNotes(company, allUsers);
    companyNotesInsertionData.push(...notes);
  });

  await db.insert(CompaniesNotesTable).values(companyNotesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: CompaniesNotes.ts');
}
