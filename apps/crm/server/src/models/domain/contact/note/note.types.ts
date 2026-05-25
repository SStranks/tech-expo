import type { UUID } from '@apps/crm-shared';

export type ContactNoteId = UUID & { readonly __contactNoteId: 'ContactNoteId' };
export type ContactNoteClientGeneratedId = UUID & {
  readonly __contactNoteClientGeneratedId: 'ContactNoteClientGeneratedId';
};
