import type { QuoteRepository } from './quote.repository.js';

export class InMemoryQuoteRepository implements QuoteRepository {
  constructor() {}
}
