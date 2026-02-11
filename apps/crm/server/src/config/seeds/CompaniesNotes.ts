import type { PostgresClient } from '#Config/dbPostgres.ts';
import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.ts';
import type { CompaniesNotesTableInsert } from '#Config/schema/companies/CompanyNotes.ts';

import CompaniesNotesTable from '#Config/schema/companies/CompanyNotes.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateCompaniesNotes } from './generators/CompaniesNotes.js';

const { COMPANY_NAME } = seedSettings;

export type CompaniesQueryCompaniesNotes = Pick<CompaniesTableSelect, 'id' | 'name' | 'industry'>;
export type SeedCompaniesNotesAllUsers = Awaited<ReturnType<typeof getAllUsers>>[number];

const getAllUsers = async (db: PostgresClient) => {
  return db.query.UserProfileTable.findMany({ columns: { id: true, firstName: true } });
};

export default async function seedCompaniesNotes(db: PostgresClient) {
  const allCompanies = await db.query.CompaniesTable.findMany({
    columns: { id: true, name: true, industry: true },
    where: (companies, { ne }) => ne(companies.name, COMPANY_NAME),
  });
  if (allCompanies.length === 0) throw new Error('Users table returned no entries');

  const allUsers = await getAllUsers(db);
  if (allUsers.length === 0) throw new Error('Users table returned no entries');

  // --------- COMPANY NOTES TABLE --------- //
  const companyNotesInsertionData: CompaniesNotesTableInsert[] = [];

  allCompanies.forEach((company) => {
    const notes = generateCompaniesNotes(company, allUsers);
    companyNotesInsertionData.push(...notes);
  });

  await db.insert(CompaniesNotesTable).values(companyNotesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: CompaniesNotes.ts');
}
