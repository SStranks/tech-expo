/* eslint-disable perfectionist/sort-objects */
import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';

import type { CompanyId } from '../company/company.types.js';
import type { ContactId } from '../contact/contact.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { QuoteClientGeneratedId, QuoteId, QuoteStage } from './quote.types.js';

export type QuoteDTO = {
  id: QuoteId;
  clientGeneratedId: QuoteClientGeneratedId;
  companyId: CompanyId;
  createdAt: Date;
  dueAt: Date | null;
  issuedAt: Date | null;
  preparedByUserProfileId: UserProfileId;
  preparedForContactId: ContactId;
  salesTax: string;
  stage: QuoteStage;
  title: string;
  totalAmount: string;
};

export const toQuoteDTO = (quote: QuotesTableSelect): QuoteDTO => ({
  id: quote.id,
  clientGeneratedId: quote.clientGeneratedId,
  title: quote.title,
  companyId: quote.companyId,
  totalAmount: quote.totalAmount,
  salesTax: quote.salesTax,
  stage: quote.stage,
  preparedForContactId: quote.preparedForContactId,
  preparedByUserProfileId: quote.preparedByUserProfileId,
  issuedAt: quote.issuedAt,
  dueAt: quote.dueAt,
  createdAt: quote.createdAt,
});
