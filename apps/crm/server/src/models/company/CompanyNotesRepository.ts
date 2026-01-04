import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type {
  CompaniesNotesTableInsert,
  CompaniesNotesTableSelect,
  CompaniesNotesTableUpdate,
} from '#Config/schema/companies/CompanyNotes.js';

export interface CompanyNotesRepository {
  deleteById(id: UUID): Promise<CompaniesNotesTableSelect['id']>;
  deleteByIds(ids: UUID[]): Promise<CompaniesNotesTableSelect['id'][]>;
  findById(id: UUID): Promise<CompaniesNotesTableSelect | null>;
  findByIds(ids: UUID[]): Promise<CompaniesNotesTableSelect[]>;
  insert(company: CompaniesNotesTableInsert): Promise<CompaniesNotesTableSelect>;
  insertMany(companies: CompaniesNotesTableInsert[]): Promise<CompaniesNotesTableSelect[]>;
  updateById(id: UUID, company: CompaniesNotesTableUpdate): Promise<CompaniesNotesTableSelect>;
  updateByIds(ids: UUID[], companies: CompaniesNotesTableUpdate[]): Promise<CompaniesNotesTableSelect[]>;
}
