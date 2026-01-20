import type { UUID } from '@apps/crm-shared';

export type ContactNoteId = UUID & { readonly __contactNoteId: unique symbol };
