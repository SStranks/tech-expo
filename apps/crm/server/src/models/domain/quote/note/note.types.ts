import type { UUID } from '@apps/crm-shared';

export type QuoteNoteId = UUID & { readonly __quoteNoteId: 'QuoteNoteId' };
export type QuoteNoteClientGeneratedId = UUID & { readonly __quoteNoteClientId: 'QuoteNoteClientGeneratedId' };
