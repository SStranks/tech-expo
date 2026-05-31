import type { PipelineDealReadRow } from '#Models/query/pipeline/pipeline.read-model.types.js';

import type { PipelineDealDTO } from '../pipeline.dto.js';

export const pipelineDealReadRowToPipelineDealDTO = (pipelineDeal: PipelineDealReadRow): PipelineDealDTO => ({
  id: pipelineDeal.id,
  clientGeneratedId: pipelineDeal.clientGeneratedId,
  companyId: pipelineDeal.companyId,
  dealContactId: pipelineDeal.dealContactId,
  dealOwnerId: pipelineDeal.dealOwnerId,
  orderKey: pipelineDeal.orderKey,
  stageId: pipelineDeal.stageId,
  title: pipelineDeal.title,
  value: pipelineDeal.value,
});
