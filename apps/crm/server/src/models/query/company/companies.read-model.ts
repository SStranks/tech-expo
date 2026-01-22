import type { UUID } from '@apps/crm-shared';

import type { PersistedCompanyNote } from '#Models/domain/company/note/note.js';

import type {
  CompaniesOverviewPaginated,
  CompaniesOverviewQuery,
  CompanyNoteReadRow,
  CompanyQuery,
  CompanyReadRow,
} from './companies.read-model.types.js';

export interface CompanyReadModel {
  count(query?: CompanyQuery): Promise<number>;
  findCompaniesByIds(ids: UUID[]): Promise<CompanyReadRow[]>;
  findCompanyOverview(query: CompaniesOverviewQuery): Promise<CompaniesOverviewPaginated>;
  findCompanyNoteByCompanyNoteId(id: UUID): Promise<PersistedCompanyNote | null>;
  findCompanyNotesByCompanyId(id: UUID): Promise<CompanyNoteReadRow[]>;
}
