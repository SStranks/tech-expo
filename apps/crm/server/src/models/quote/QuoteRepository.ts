import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { QuotesTableInsert, QuotesTableSelect, QuotesTableUpdate } from '#Config/schema/quotes/Quotes.js';

export interface QuoteRepository {
  deleteById(id: UUID): Promise<QuotesTableSelect['id']>;
  deleteByIds(ids: UUID[]): Promise<QuotesTableSelect['id'][]>;
  findById(id: UUID): Promise<QuotesTableSelect | null>;
  findByIds(ids: UUID[]): Promise<QuotesTableSelect[]>;
  insert(company: QuotesTableInsert): Promise<QuotesTableSelect>;
  insertMany(companies: QuotesTableInsert[]): Promise<QuotesTableSelect[]>;
  updateById(id: UUID, company: QuotesTableUpdate): Promise<QuotesTableSelect>;
  updateByIds(ids: UUID[], companies: QuotesTableUpdate[]): Promise<QuotesTableSelect[]>;
}
