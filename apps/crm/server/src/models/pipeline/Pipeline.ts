/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { PipelineDealsTableSelect } from '#Config/schema/pipeline/Deals.js';

export type PipelineDealDTO = {
  id: UUID;
  orderKey: string;
  title: string;
  company: UUID;
  stage: UUID;
  value: string;
  dealOwner: UUID;
  dealContact: UUID;
};

export const toPipelineDealDTO = (pipelineDeal: PipelineDealsTableSelect): PipelineDealDTO => ({
  id: pipelineDeal.id,
  orderKey: pipelineDeal.orderKey,
  title: pipelineDeal.title,
  company: pipelineDeal.company,
  stage: pipelineDeal.stage,
  value: pipelineDeal.value,
  dealOwner: pipelineDeal.dealOwner,
  dealContact: pipelineDeal.dealContact,
});
