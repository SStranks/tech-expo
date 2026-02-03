import type { QuotesTableInsert } from '#Config/schema/quotes/Quotes.ts';

import type { SeedQuoteCompany, SeedQuoteUser } from '../Quotes.js';

import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

import { QUOTE_STAGE } from '#Models/domain/quote/quote.types.js';

const NEW_DATE = new Date();

export function generateQuote(company: SeedQuoteCompany, user: SeedQuoteUser): QuotesTableInsert {
  let dueAt: Date | null = null,
    issuedAt: Date | null = null;
  const title = `TE25-${nanoid(10)}`;
  const preparedForContactId = faker.helpers.arrayElement(company.contacts).id;
  const stage = faker.helpers.arrayElement(QUOTE_STAGE);

  if (stage === 'ACCEPTED') {
    issuedAt = faker.date.recent({ days: 30 });
    dueAt = NEW_DATE;
    dueAt = new Date(NEW_DATE.setDate(issuedAt.getDate() + 30));
  }
  const salesTax = '20.00';

  return {
    companyId: company.id,
    dueAt,
    issuedAt,
    preparedByUserProfileId: user.id,
    preparedForContactId,
    salesTax,
    stage,
    title,
  };
}
