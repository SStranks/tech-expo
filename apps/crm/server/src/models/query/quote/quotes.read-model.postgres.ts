import type { QuoteId } from '#Models/domain/quote/quote.types.js';
import type { QuoteServiceId } from '#Models/domain/quote/service/service.types.js';

import type { PaginatedCompanyQuotes, PaginatedCompanyQuotesQuery } from '../company/companies.read-model.types.js';
import type { QuoteReadModel } from './quotes.read-model.js';
import type {
  QuoteNoteReadRow,
  QuoteReadRow,
  QuoteServiceReadRow,
  QuotesOverviewPaginated,
  QuotesOverviewQuery,
} from './quotes.read-model.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

import { quoteNoteRowToQuoteNoteReadRow } from './quotes.read-model.mapper.js';

export class PostgresQuoteReadModel implements QuoteReadModel {
  async findQuoteNoteByQuoteId(id: QuoteId): Promise<QuoteNoteReadRow | null> {
    return postgresDBCall(async () => {
      const row = await postgresDB.query.QuotesNotesTable.findFirst({
        where: (quoteNote, { eq }) => eq(quoteNote.quoteId, id),
      });

      return row ? quoteNoteRowToQuoteNoteReadRow(row) : null;
    });
  }

  async findQuotesByIds(ids: QuoteId[]): Promise<QuoteReadRow[]> {
    return postgresDBCall(async () => {
      const rows = await postgresDB.query.QuotesTable.findMany({
        where: (quote, { inArray }) => inArray(quote.id, ids),
      });

      return rows.map((row) => ({
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
      }));
    });
  }

  findQuoteServiceByQuoteServiceId(_quoteServiceId: QuoteServiceId): Promise<QuoteServiceReadRow | null> {
    throw new Error('Not yet implemented.');
  }

  findQuoteServicesByQuoteId(_quoteId: QuoteId): Promise<QuoteServiceReadRow[]> {
    throw new Error('Not yet implemented.');
  }

  findQuotesByCompanyId(_query: PaginatedCompanyQuotesQuery): Promise<PaginatedCompanyQuotes> {
    throw new Error('Not yet implemented.');
  }

  findQuotesOverview(_query: QuotesOverviewQuery): Promise<QuotesOverviewPaginated> {
    throw new Error('Not yet implemented.');
  }
}
