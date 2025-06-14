import type { UUID } from 'node:crypto';

import type { TCompanyDTO } from '#Models/company/Company.js';

import { notFoundError } from '#Graphql/errors.js';
import { PostgresCompanyRepository } from '#Models/index.js';

export type TCompanyService = {
  getCompanyById(id: UUID): Promise<TCompanyDTO>;
  getAllCompanies(): Promise<TCompanyDTO[]>;
};

export async function getCompanyById(id: UUID) {
  const company = await PostgresCompanyRepository.findById(id);
  if (!company) throw notFoundError('Company not found');
  return company;
}

export async function getAllCompanies() {
  const companies = await PostgresCompanyRepository.findAll();
  return companies;
}
