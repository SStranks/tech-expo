/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';

import type { QuoteStage } from './quote.types.js';

export type QuoteDTO = {
  id: UUID;
  title: string;
  company: UUID;
  totalAmount: string;
  salesTax: string;
  stage: QuoteStage;
  preparedFor: UUID;
  preparedBy: UUID;
  issuedAt: Date | null;
  dueAt: Date | null;
  createdAt: Date;
};

export const toQuoteDTO = (quote: QuotesTableSelect): QuoteDTO => ({
  id: quote.id,
  title: quote.title,
  company: quote.company,
  totalAmount: quote.total,
  salesTax: quote.salesTax,
  stage: quote.stage,
  preparedFor: quote.preparedFor,
  preparedBy: quote.preparedBy,
  issuedAt: quote.issuedAt,
  dueAt: quote.dueAt,
  createdAt: quote.createdAt,
});
