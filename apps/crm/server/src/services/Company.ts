import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { TCompanyDTO } from '#Models/company/Company.js';

import { notFoundError } from '#Graphql/errors.js';
import { toDbUUID } from '#Helpers/helpers.js';
import PostgresCompanyRepository from '#Models/company/PostgresCompanyRepository.js';

export interface CompanyService {
  getCompanyById(id: UUID): Promise<TCompanyDTO>;
  getAllCompanies(): Promise<TCompanyDTO[]>;
}

export class CompanyService implements CompanyService {
  constructor() {}

  async getCompanyById(id: UUID): Promise<TCompanyDTO> {
    const company = await PostgresCompanyRepository.findById(toDbUUID(id));
    if (!company) throw notFoundError('Company not found');
    return company;
  }

  async getAllCompanies(): Promise<TCompanyDTO[]> {
    const companies = await PostgresCompanyRepository.findAll();
    return companies;
  }
}
