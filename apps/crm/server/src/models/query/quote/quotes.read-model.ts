import type { QuoteId } from '#Models/domain/quote/quote.types.js';

import type { QuoteNoteReadRow, QuoteReadRow } from './quotes.read-model.types.js';

export interface QuoteReadModel {
  findQuoteNoteByQuoteId(id: QuoteId): Promise<QuoteNoteReadRow | null>;
  findQuotesByIds(ids: QuoteId[]): Promise<QuoteReadRow[]>;
}
