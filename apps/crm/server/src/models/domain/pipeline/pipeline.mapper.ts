/* eslint-disable perfectionist/sort-objects */
import type { PipelineDealReadRow } from '#Models/query/pipeline/pipeline.read-model.types.js';

import type { PipelineDealDTO } from './pipeline.dto.js';

export const pipelineDealReadRowToDTO = (pipelineDeal: PipelineDealReadRow): PipelineDealDTO => ({
  id: pipelineDeal.id,
  orderKey: pipelineDeal.orderKey,
  title: pipelineDeal.title,
  companyId: pipelineDeal.companyId,
  stageId: pipelineDeal.stageId,
  value: pipelineDeal.value,
  dealOwnerId: pipelineDeal.dealOwnerId,
  dealContactId: pipelineDeal.dealContactId,
});
