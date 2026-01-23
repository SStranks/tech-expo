/* eslint-disable perfectionist/sort-objects */
import type { PipelineDealReadRow } from '#Models/query/pipeline/pipeline.read-model.types.js';

import type { PipelineDealDTO } from '../pipeline.dto.js';

export const pipelineDealReadRowToDTO = (deal: PipelineDealReadRow): PipelineDealDTO => ({
  id: deal.id,
  orderKey: deal.orderKey,
  title: deal.title,
  company: deal.company,
  stage: deal.stage,
  value: deal.value,
  dealOwner: deal.dealOwner,
  dealContact: deal.dealContact,
});
