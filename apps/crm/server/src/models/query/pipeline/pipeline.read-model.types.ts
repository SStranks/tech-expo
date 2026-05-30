import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { PipelineDealClientGeneratedId, PipelineDealId } from '#Models/domain/pipeline/deal/deal.types.js';
import type { PipelineStageId } from '#Models/domain/pipeline/stage/stage.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

export type PipelineDealReadRow = {
  id: PipelineDealId;
  clientGeneratedId: PipelineDealClientGeneratedId;
  companyId: CompanyId;
  createdAt: Date;
  dealContactId: ContactId;
  dealOwnerId: UserProfileId;
  orderKey: string;
  stageId: PipelineStageId;
  title: string;
  value: string;
};
