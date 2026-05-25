import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';

import type { NewQuote, PersistedQuote } from './quote.js';
import type { QuoteRepository } from './quote.repository.js';
import type { QuoteId } from './quote.types.js';

export class InMemoryQuoteRepository implements QuoteRepository {
  constructor() {}
  save(_contact: NewQuote | PersistedQuote): Promise<PersistedQuote> {
    throw new Error('Method not implemented.');
  }

  remove(_id: QuoteId): Promise<QuoteId> {
    throw new Error('Method not implemented.');
  }

  findQuoteById(_id: QuoteId): Promise<PersistedQuote | null> {
    throw new Error('Method not implemented.');
  }

  findQuotesByIds(_ids: QuoteId[]): Promise<PersistedQuote[]> {
    throw new Error('Method not implemented.');
  }

  findByIds(_ids: QuoteId[]): Promise<QuotesTableSelect[]> {
    throw new Error('Method not implemented.');
  }
}
