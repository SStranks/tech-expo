import type { UUID } from '@apps/crm-shared';

export type QuoteNoteId = UUID & { readonly __quoteNoteId: unique symbol };
export type QuoteNoteClientId = UUID & { readonly __quoteNoteClientId: unique symbol };
