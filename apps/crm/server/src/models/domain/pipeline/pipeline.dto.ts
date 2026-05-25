import type { CompanyId } from '../company/company.types.js';
import type { ContactId } from '../contact/contact.types.js';
import type { UserProfileId } from '../user/profile/profile.types.js';
import type { PipelineDealId } from './deal/deal.types.js';
import type { PipelineStageId } from './stage/stage.types.js';

export type PipelineDealDTO = {
  id: PipelineDealId;
  orderKey: string;
  title: string;
  companyId: CompanyId;
  stageId: PipelineStageId;
  value: string;
  dealOwnerId: UserProfileId;
  dealContactId: ContactId;
};
