import type { UUID } from '@apps/crm-shared';

import type { QuoteNoteDTO } from './note.dto.js';
import type { PersistedQuoteNote } from './note.js';
import type { QuoteNoteId } from './note.types.js';

export function asQuoteNoteId(id: UUID): QuoteNoteId {
  return id as QuoteNoteId;
}

export function quoteNoteDomainToQuoteNoteDTO(quoteNote: PersistedQuoteNote): QuoteNoteDTO {
  return {
    id: quoteNote.id,
    clientGeneratedId: quoteNote.clientGeneratedId,
    content: quoteNote.content,
    createdAt: quoteNote.createdAt,
    quoteId: quoteNote.quoteId,
  };
}
