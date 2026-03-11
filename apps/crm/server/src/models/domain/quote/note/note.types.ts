import type { UUID } from '@apps/crm-shared';

export type QuoteNoteId = UUID & { readonly __quoteNoteId: unique symbol };
export type QuoteNoteSymbol = UUID & { readonly __quoteNoteSymbol: unique symbol };
