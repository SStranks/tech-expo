import type { PipelineRepository } from '#Models/domain/pipeline/pipeline.repository.js';
import type {
  PaginatedCompanyDealsQuery,
  PaginatedCompanyPipelineDeals,
} from '#Models/query/company/companies.read-model.types.js';
import type { PipelineReadModel } from '#Models/query/pipeline/pipeline.read-model.js';

interface IPipelineService {
  getPaginatedDealsForCompany(query: PaginatedCompanyDealsQuery): Promise<PaginatedCompanyPipelineDeals>;
}

export class PipelineService implements IPipelineService {
  constructor(
    private readonly pipelineRepository: PipelineRepository,
    private readonly pipelineReadModel: PipelineReadModel
  ) {}

  // ------- COMMANDs ------ //
  // ------- QUERIES ------- //

  getPaginatedDealsForCompany(_query: PaginatedCompanyDealsQuery): Promise<PaginatedCompanyPipelineDeals> {
    throw new Error('Method not implemented.');
  }
}
