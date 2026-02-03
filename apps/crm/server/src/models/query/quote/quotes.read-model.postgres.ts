/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { QuoteReadModel } from './quotes.read-model.js';
import type { QuoteReadRow } from './quotes.read-model.types.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

export class PostgresQuoteReadModel implements QuoteReadModel {
  async findQuotesByIds(ids: UUID[]): Promise<QuoteReadRow[]> {
    return postgresDBCall(async () => {
      const quotes = await postgresDB.query.QuotesTable.findMany({
        where: (quote, { inArray }) => inArray(quote.id, ids),
      });

      return quotes.map((q) => ({
        id: q.id,
        title: q.title,
        companyId: q.companyId,
        totalAmount: q.totalAmount,
        salesTax: q.salesTax,
        stage: q.stage,
        preparedForContactId: q.preparedForContactId,
        preparedByUserProfileId: q.preparedByUserProfileId,
        issuedAt: q.issuedAt,
        dueAt: q.dueAt,
        createdAt: q.createdAt,
      }));
    });
  }
}
