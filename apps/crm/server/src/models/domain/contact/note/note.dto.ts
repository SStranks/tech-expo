import type { UUID } from '@apps/crm-shared';

export type ContactNoteDTO = {
  id: UUID;
  note: string;
  createdBy: UUID;
  createdAt: Date;
};
