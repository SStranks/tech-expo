import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type {
  PipelineDealsTableInsert,
  PipelineDealsTableSelect,
  PipelineDealsTableUpdate,
} from '#Config/schema/pipeline/Deals.js';

export interface PipelineDealRepository {
  deleteById(id: UUID): Promise<PipelineDealsTableSelect['id']>;
  deleteByIds(ids: UUID[]): Promise<PipelineDealsTableSelect['id'][]>;
  findById(id: UUID): Promise<PipelineDealsTableSelect | null>;
  findByIds(ids: UUID[]): Promise<PipelineDealsTableSelect[]>;
  insert(company: PipelineDealsTableInsert): Promise<PipelineDealsTableSelect>;
  insertMany(companies: PipelineDealsTableInsert[]): Promise<PipelineDealsTableSelect[]>;
  updateById(id: UUID, company: PipelineDealsTableUpdate): Promise<PipelineDealsTableSelect>;
  updateByIds(ids: UUID[], companies: PipelineDealsTableUpdate[]): Promise<PipelineDealsTableSelect[]>;
}
