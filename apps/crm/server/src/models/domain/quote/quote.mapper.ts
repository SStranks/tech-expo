import type { UUID } from '@apps/crm-shared';

import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';

import type { QuoteDTO } from './quote.dto.js';
import type { PersistedQuote } from './quote.js';
import type { QuoteClientGeneratedId, QuoteId } from './quote.types.js';

import { Quote } from './quote.js';

export function asQuoteId(id: UUID): QuoteId {
  return id as QuoteId;
}

export function asQuoteClientGeneratedId(id: UUID): QuoteClientGeneratedId {
  return id as QuoteClientGeneratedId;
}

export function quoteReadRowToQuoteDTO(row: QuotesTableSelect): QuoteDTO {
  return {
    id: row.id,
    clientGeneratedId: row.clientGeneratedId,
    companyId: row.companyId,
    createdAt: row.createdAt,
    dueAt: row.dueAt,
    issuedAt: row.issuedAt,
    preparedByUserProfileId: row.preparedByUserProfileId,
    preparedForContactId: row.preparedForContactId,
    salesTax: row.salesTax,
    stage: row.stage,
    title: row.title,
    totalAmount: row.totalAmount,
  };
}

export function quoteDomainToQuoteDTO(quote: PersistedQuote): QuoteDTO {
  return {
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
  };
}

export function quoteRowToDomain(row: QuotesTableSelect): PersistedQuote {
  return Quote.rehydrate({
    id: row.id,
    clientGeneratedId: row.clientGeneratedId,
    companyId: row.companyId,
    createdAt: row.createdAt,
    dueAt: row.dueAt,
    issuedAt: row.issuedAt,
    preparedByUserProfileId: row.preparedByUserProfileId,
    preparedForContactId: row.preparedForContactId,
    salesTax: row.salesTax,
    stage: row.stage,
    title: row.title,
    totalAmount: row.totalAmount,
  });
}
