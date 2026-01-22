import type { UUID } from '@apps/crm-shared';

import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';

export interface QuoteRepository {
  findByIds(ids: UUID[]): Promise<QuotesTableSelect[]>;
}
