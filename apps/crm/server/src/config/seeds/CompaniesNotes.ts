import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TCompaniesNotesTableInsert } from '#Config/schema/index.js';

import { CompaniesNotesTable } from '#Config/schema/index.js';

import { chainNotes, nonChainNotes } from './generators/CompanyNotes.js';

export default async function seedCompaniesNotes(db: TPostgresDB) {
  const allCompanies = await db.query.CompaniesTable.findMany({ columns: { id: true } });
  const allUsers = await db.query.UserProfileTable.findMany({ columns: { id: true, firstName: true } });

  // TODO:  Could amend the comments JSON with chatGPT; group into the different industry types - currently comments can be conflict with the company type and/or against other comments.
  // --------- COMPANY NOTES --------- //
  const companyNotesData: TCompaniesNotesTableInsert[] = [];

  allCompanies.forEach((company) => {
    const randInt = Math.random();
    const notes = randInt < 0.65 ? chainNotes(company.id, allUsers) : nonChainNotes(company.id, allUsers);
    companyNotesData.push(...notes);
  });

  await db.insert(CompaniesNotesTable).values(companyNotesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: CompaniesNotes.ts');
}
