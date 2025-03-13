import type { TPostgresDB } from '#Config/dbPostgres.js';
import type { TQuotesTableInsert } from '#Config/schema/index.js';

import { faker } from '@faker-js/faker';

import { QuotesTable } from '#Config/schema/index.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateQuote } from './generators/Quotes.js';

export type TSeedQuoteCompany = Awaited<ReturnType<typeof getCompanies>>[number];
export type TSeedQuoteUser = Awaited<ReturnType<typeof getUsers>>[number];

const { COMPANY_NAME, COMPANY_QUOTES_MAX, COMPANY_QUOTES_MIN } = seedSettings;

const getCompanies = async (db: TPostgresDB) => {
  return await db.query.CompaniesTable.findMany({
    columns: { id: true, companyName: true, country: true, website: true },
    with: { contacts: { columns: { id: true, firstName: true, lastName: true } } },
    where: (CompaniesTable, { ne }) => ne(CompaniesTable.companyName, COMPANY_NAME),
  });
};

const getUsers = async (db: TPostgresDB) => {
  return await db.query.UserProfileTable.findMany({
    columns: { id: true, firstName: true, lastName: true },
  });
};

export default async function seedQuotes(db: TPostgresDB) {
  const quotesData: TQuotesTableInsert[] = [];
  const companies = await getCompanies(db);
  const users = await getUsers(db);

  // ------------- QUOTES ------------ //
  // Generate between 0 - 3 quotes per company
  companies.forEach((company) => {
    const randNumOfQuotes = faker.number.int({ max: COMPANY_QUOTES_MAX, min: COMPANY_QUOTES_MIN });

    for (let i = 0; i < randNumOfQuotes; i++) {
      const quotePreparedBy = faker.helpers.arrayElement(users);
      quotesData.push(generateQuote(company, quotePreparedBy));
    }
  });

  await db.insert(QuotesTable).values(quotesData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Quotes.ts');
}
