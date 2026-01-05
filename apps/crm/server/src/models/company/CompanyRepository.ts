import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type {
  CompaniesTableInsert,
  CompaniesTableSelect,
  CompaniesTableUpdate,
} from '#Config/schema/companies/Companies.js';

import type { CompanyQuery, CompanyWithRelations } from './Company.js';

export interface CompanyRepository {
  deleteById(id: UUID): Promise<CompaniesTableSelect['id']>;
  deleteByIds(ids: UUID[]): Promise<CompaniesTableSelect['id'][]>;
  findById(id: UUID): Promise<CompaniesTableSelect | null>;
  findByIds(ids: UUID[]): Promise<CompaniesTableSelect[]>;
  findManyWithContactsAndOwner(query: CompanyQuery): Promise<CompanyWithRelations[]>;
  insert(company: CompaniesTableInsert): Promise<CompaniesTableSelect>;
  insertMany(companies: CompaniesTableInsert[]): Promise<CompaniesTableSelect[]>;
  updateById(id: UUID, patch: CompaniesTableUpdate): Promise<CompaniesTableSelect>;
  updateByIds(ids: UUID[], patch: CompaniesTableUpdate): Promise<CompaniesTableSelect[]>;
}
