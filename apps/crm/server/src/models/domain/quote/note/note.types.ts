import type { UUID } from '@apps/crm-shared';

export type QuoteNoteId = UUID & { readonly __quoteNoteId: 'QuoteNoteId' };
export type QuoteNoteClientId = UUID & { readonly __quoteNoteClientId: 'QuoteNoteClientId' };
