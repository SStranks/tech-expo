import type { UUID } from '@apps/crm-shared';

export type ContactNoteId = UUID & { readonly __contactNoteId: unique symbol };
export type ContactNoteClientId = UUID & { readonly __contactNoteClientId: unique symbol };
