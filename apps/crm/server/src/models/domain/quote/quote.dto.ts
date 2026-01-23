/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';

import type { QuoteStage } from './quote.types.js';

export type QuoteDTO = {
  id: UUID;
  title: string;
  companyId: UUID;
  totalAmount: string;
  salesTax: string;
  stage: QuoteStage;
  preparedForContactId: UUID;
  preparedByUserProfileId: UUID;
  issuedAt: Date | null;
  dueAt: Date | null;
  createdAt: Date;
};

export const toQuoteDTO = (quote: QuotesTableSelect): QuoteDTO => ({
  id: quote.id,
  title: quote.title,
  companyId: quote.companyId,
  totalAmount: quote.total,
  salesTax: quote.salesTax,
  stage: quote.stage,
  preparedForContactId: quote.preparedForContactId,
  preparedByUserProfileId: quote.preparedByUserProfileId,
  issuedAt: quote.issuedAt,
  dueAt: quote.dueAt,
  createdAt: quote.createdAt,
});
