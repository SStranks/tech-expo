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
  companyId: quote.companyId,
  createdAt: quote.createdAt,
  dueAt: quote.dueAt,
  issuedAt: quote.issuedAt,
  preparedByUserProfileId: quote.preparedByUserProfileId,
  preparedForContactId: quote.preparedForContactId,
  salesTax: quote.salesTax,
  stage: quote.stage,
  title: quote.title,
  totalAmount: quote.totalAmount,
});
