/* eslint-disable perfectionist/sort-objects */
import type { QuoteId } from '#Models/domain/quote/quote.types.js';

import type { QuoteReadModel } from './quotes.read-model.js';
import type { QuoteNoteReadRow, QuoteReadRow } from './quotes.read-model.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import { asCompanyId } from '#Models/domain/company/company.mapper.js';
import { asContactId } from '#Models/domain/contact/contact.mapper.js';
import { asQuoteClientGeneratedId } from '#Models/domain/quote/quote.mapper.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';

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
        clientGeneratedId: asQuoteClientGeneratedId(row.clientGeneratedId),
        title: row.title,
        companyId: asCompanyId(row.companyId),
        totalAmount: row.totalAmount,
        salesTax: row.salesTax,
        stage: row.stage,
        preparedForContactId: asContactId(row.preparedForContactId),
        preparedByUserProfileId: asUserProfileId(row.preparedByUserProfileId),
        issuedAt: row.issuedAt,
        dueAt: row.dueAt,
        createdAt: row.createdAt,
      }));
    });
  }
}
