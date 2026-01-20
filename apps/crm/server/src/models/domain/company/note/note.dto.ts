import type { UUID } from '@apps/crm-shared';

export type CompanyNoteDTO = {
  id: UUID;
  note: string;
  createdBy: UUID;
  createdAt: Date;
};
