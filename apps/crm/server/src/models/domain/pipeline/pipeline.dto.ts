import type { CompanyId } from '../company/company.types.js';
import type { ContactId } from '../contact/contact.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { PipelineDealClientGeneratedId, PipelineDealId } from './deal/deal.types.js';
import type { PipelineStageId } from './stage/stage.types.js';

export type PipelineDealDTO = {
  id: PipelineDealId;
  clientGeneratedId: PipelineDealClientGeneratedId;
  companyId: CompanyId;
  dealContactId: ContactId;
  dealOwnerId: UserProfileId;
  orderKey: string;
  stageId: PipelineStageId;
  title: string;
  value: string;
};
