import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { PersistedCompanyNote } from '#Models/domain/company/note/note.js';
import type { CompanyNoteId } from '#Models/domain/company/note/note.types.js';

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

  findCompaniesByIds(_ids: CompanyId[]): Promise<CompanyReadRow[]> {
    throw new Error('Method not implemented.');
  }

  findCompanyOverview(_query: CompaniesOverviewQuery): Promise<CompaniesOverviewPaginated> {
    throw new Error('Method not implemented.');
  }

  findCompanyNoteById(_id: CompanyNoteId): Promise<PersistedCompanyNote | null> {
    throw new Error('Method not implemented.');
  }

  findCompanyNotesByCompanyId(_id: CompanyId): Promise<CompanyNoteReadRow[]> {
    throw new Error('Method not implemented.');
  }
}
