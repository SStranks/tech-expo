import type { UUID } from '@apps/crm-shared';

export type ContactNoteDTO = {
  id: UUID;
  note: string;
  createdByUserProfileId: UUID;
  createdAt: Date;
};
