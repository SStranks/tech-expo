import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { PersistedCompanyNote } from '#Models/domain/company/note/note.js';
import type { CompanyNoteId } from '#Models/domain/company/note/note.types.js';

import type {
  CompaniesOverviewPaginated,
  CompaniesOverviewQuery,
  CompanyNoteReadRow,
  CompanyQuery,
  CompanyReadRow,
} from './companies.read-model.types.js';

export interface CompanyReadModel {
  count(query?: CompanyQuery): Promise<number>;
  findCompaniesByIds(ids: CompanyId[]): Promise<CompanyReadRow[]>;
  findCompanyOverview(query: CompaniesOverviewQuery): Promise<CompaniesOverviewPaginated>;
  findCompanyNoteById(id: CompanyNoteId): Promise<PersistedCompanyNote | null>;
  findCompanyNotesByCompanyId(id: CompanyId): Promise<CompanyNoteReadRow[]>;
}
