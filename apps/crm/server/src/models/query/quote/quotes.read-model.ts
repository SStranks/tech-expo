import type { UUID } from '@apps/crm-shared';

import type { QuoteReadRow } from './quotes.read-model.types.js';

export interface QuoteReadModel {
  findQuotesByIds(ids: UUID[]): Promise<QuoteReadRow[]>;
}
