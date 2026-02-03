/* eslint-disable perfectionist/sort-objects */
import type { PipelineDealReadRow } from '#Models/query/pipeline/pipeline.read-model.types.js';

import type { PipelineDealDTO } from '../pipeline.dto.js';

export const pipelineDealReadRowToDTO = (deal: PipelineDealReadRow): PipelineDealDTO => ({
  id: deal.id,
  orderKey: deal.orderKey,
  title: deal.title,
  companyId: deal.companyId,
  stageId: deal.stageId,
  value: deal.value,
  dealOwnerId: deal.dealOwnerId,
  dealContactId: deal.dealContactId,
});
