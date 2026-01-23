import type { UUID } from '@apps/crm-shared';

export type PipelineDealDTO = {
  id: UUID;
  orderKey: string;
  title: string;
  companyId: UUID;
  stageId: UUID;
  value: string;
  dealOwnerId: UUID;
  dealContactId: UUID;
};
