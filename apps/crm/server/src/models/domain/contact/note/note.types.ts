import type { UUID } from '@apps/crm-shared';

export type ContactNoteId = UUID & { readonly __contactNoteId: 'ContactNoteId' };
export type ContactNoteClientId = UUID & { readonly __contactNoteClientId: 'ContactNoteClientId' };
