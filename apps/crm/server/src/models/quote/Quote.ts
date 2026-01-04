/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';

export type QuoteStage = (typeof QUOTE_STAGE)[number];
export const QUOTE_STAGE = ['DRAFT', 'SENT', 'ACCEPTED'] as const;

export type QuoteDTO = {
  id: UUID;
  title: string;
  company: UUID;
  total: string;
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
  total: quote.total,
  salesTax: quote.salesTax,
  stage: quote.stage,
  preparedFor: quote.preparedFor,
  preparedBy: quote.preparedBy,
  issuedAt: quote.issuedAt,
  dueAt: quote.dueAt,
  createdAt: quote.createdAt,
});
