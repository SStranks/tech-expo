import type { UUID } from '@apps/crm-shared';

import type { QuoteRepository } from './quote.repository.js';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';

export class PostgresQuoteRepository implements QuoteRepository {
  constructor() {}

  async findByIds(ids: UUID[]) {
    return postgresDBCall(async () => {
      return await postgresDB.query.QuotesTable.findMany({
        where: (quote, { inArray }) => inArray(quote.id, ids),
      });
    });
  }
}
