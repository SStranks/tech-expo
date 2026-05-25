import type { NewQuote, PersistedQuote } from './quote.js';
import type { QuoteId } from './quote.types.js';

// import type { QuoteId } from './quote.types.js';

export interface QuoteRepository {
  save(contact: NewQuote | PersistedQuote): Promise<PersistedQuote>;
  remove(id: QuoteId): Promise<QuoteId>;
  findQuoteById(id: QuoteId): Promise<PersistedQuote | null>;
  findQuotesByIds(ids: QuoteId[]): Promise<PersistedQuote[]>;
}
