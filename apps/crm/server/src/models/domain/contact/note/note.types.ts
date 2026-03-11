import type { UUID } from '@apps/crm-shared';

export type ContactNoteId = UUID & { readonly __contactNoteId: unique symbol };
export type ContactNoteSymbol = UUID & { readonly __contactNoteSymbol: unique symbol };
