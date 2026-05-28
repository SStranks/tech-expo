import type { QuoteId } from '../quote.types.js';
import type { QuoteNoteClientGeneratedId, QuoteNoteId } from './note.types.js';

export type QuoteNoteDTO = {
  id: QuoteNoteId;
  clientGeneratedId: QuoteNoteClientGeneratedId;
  content: string;
  createdAt: Date;
  quoteId: QuoteId;
};
