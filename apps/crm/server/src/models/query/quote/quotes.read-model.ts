import type { QuoteId } from '#Models/domain/quote/quote.types.js';
import type { QuoteServiceId } from '#Models/domain/quote/service/service.types.js';

import type { PaginatedCompanyQuotes, PaginatedCompanyQuotesQuery } from '../company/companies.read-model.types.js';
import type {
  QuoteNoteReadRow,
  QuoteReadRow,
  QuoteServiceReadRow,
  QuotesOverviewPaginated,
  QuotesOverviewQuery,
} from './quotes.read-model.types.js';

export interface QuoteReadModel {
  findQuoteNoteByQuoteId(quoteId: QuoteId): Promise<QuoteNoteReadRow | null>;
  findQuotesByCompanyId(query: PaginatedCompanyQuotesQuery): Promise<PaginatedCompanyQuotes>;
  findQuotesByIds(quoteIds: QuoteId[]): Promise<QuoteReadRow[]>;
  findQuoteServiceByQuoteServiceId(quoteServiceId: QuoteServiceId): Promise<QuoteServiceReadRow | null>;
  findQuoteServicesByQuoteId(quoteId: QuoteId): Promise<QuoteServiceReadRow[]>;
  findQuotesOverview(query: QuotesOverviewQuery): Promise<QuotesOverviewPaginated>;
}
