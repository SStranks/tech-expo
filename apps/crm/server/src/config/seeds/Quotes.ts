import type { PostgresClient } from '#Config/dbPostgres.js';
import type { QuotesTableInsert } from '#Config/schema/quotes/Quotes.ts';

import { faker } from '@faker-js/faker';

import QuotesTable from '#Config/schema/quotes/Quotes.js';
import { seedSettings } from '#Config/seedSettings.js';

import { generateQuote } from './generators/Quotes.js';

export type SeedQuoteCompany = Awaited<ReturnType<typeof getCompanies>>[number];
export type SeedQuoteUser = Awaited<ReturnType<typeof getUsers>>[number];

const { COMPANY_NAME, COMPANY_QUOTES_MAX, COMPANY_QUOTES_MIN } = seedSettings;

const getCompanies = async (db: PostgresClient) => {
  return db.query.CompaniesTable.findMany({
    columns: { id: true, name: true, countryId: true, website: true },
    with: { contacts: { columns: { id: true, firstName: true, lastName: true } } },
    where: (CompaniesTable, { ne }) => ne(CompaniesTable.name, COMPANY_NAME),
  });
};

const getUsers = async (db: PostgresClient) => {
  return db.query.UserProfileTable.findMany({
    columns: { id: true, firstName: true, lastName: true },
  });
};

export default async function seedQuotes(db: PostgresClient) {
  const quotesInsertionData: QuotesTableInsert[] = [];
  const companies = await getCompanies(db);
  const users = await getUsers(db);

  // ------------- QUOTES ------------ //
  // Generate between 0 - 3 quotes per company
  companies.forEach((company) => {
    const randNumOfQuotes = faker.number.int({ max: COMPANY_QUOTES_MAX, min: COMPANY_QUOTES_MIN });

    for (let i = 0; i < randNumOfQuotes; i++) {
      const quotePreparedBy = faker.helpers.arrayElement(users);
      quotesInsertionData.push(generateQuote(company, quotePreparedBy));
    }
  });

  await db.insert(QuotesTable).values(quotesInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Quotes.ts');
}
