import type { TQuotesTableInsert } from '#Config/schema/index.js';

import type { TSeedQuoteCompany, TSeedQuoteUser } from '../Quotes.js';

import { faker } from '@faker-js/faker';

import { QUOTE_STAGE } from '#Config/schema/quotes/Quotes.js';

const NEW_DATE = new Date();

export function generateQuote(company: TSeedQuoteCompany, user: TSeedQuoteUser): TQuotesTableInsert {
  let dueAt: Date | null = null,
    issuedAt: Date | null = null;
  const title = `TE25-${faker.string.alphanumeric({ casing: 'mixed', length: 7 })}`;
  const preparedFor = faker.helpers.arrayElement(company.contacts).id;
  const stage = faker.helpers.arrayElement(QUOTE_STAGE);

  if (stage === 'accepted') {
    issuedAt = faker.date.recent({ days: 30 });
    dueAt = NEW_DATE;
    dueAt = new Date(NEW_DATE.setDate(issuedAt.getDate() + 30));
  }
  const salesTax = '20.00';

  return {
    company: company.id,
    dueAt,
    issuedAt,
    preparedBy: user.id,
    preparedFor,
    salesTax,
    stage,
    title,
  };
}
