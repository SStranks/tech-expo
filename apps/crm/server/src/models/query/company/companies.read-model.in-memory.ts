import type { UUID } from '@apps/crm-shared';

import type { PersistedCompanyNote } from '#Models/domain/company/note/note.js';

import type { CompanyReadModel } from './companies.read-model.js';
import type {
  CompaniesOverviewPaginated,
  CompaniesOverviewQuery,
  CompanyNoteReadRow,
  CompanyQuery,
  CompanyReadRow,
} from './companies.read-model.types.js';

export class InMemoryCompanyReadModel implements CompanyReadModel {
  constructor() {}

  count(_query?: CompanyQuery): Promise<number> {
    throw new Error('Method not implemented.');
  }

  findCompaniesByIds(_ids: UUID[]): Promise<CompanyReadRow[]> {
    throw new Error('Method not implemented.');
  }

  findCompanyOverview(_query: CompaniesOverviewQuery): Promise<CompaniesOverviewPaginated> {
    throw new Error('Method not implemented.');
  }

  findCompanyNoteByCompanyNoteId(_id: UUID): Promise<PersistedCompanyNote | null> {
    throw new Error('Method not implemented.');
  }

  findCompanyNotesByCompanyId(_id: UUID): Promise<CompanyNoteReadRow[]> {
    throw new Error('Method not implemented.');
  }
}
