import type { UUID } from '@apps/crm-shared';

import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';

import type { QuoteRepository } from './quote.repository.js';

export class InMemoryQuoteRepository implements QuoteRepository {
  constructor() {}
  findByIds(_ids: UUID[]): Promise<QuotesTableSelect[]> {
    throw new Error('Method not implemented.');
  }
}
