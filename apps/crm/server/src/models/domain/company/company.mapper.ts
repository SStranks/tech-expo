import type { UUID } from '@apps/crm-shared';

import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';
import type { CompanyReadRow } from '#Models/query/company/companies.read-model.types.js';

import type { CompanyDTO } from './company.dto.js';
import type { PersistedCompany } from './company.js';
import type { CompanyId } from './company.types.js';

import { Company } from './company.js';

export function asCompanyId(id: UUID): CompanyId {
  return id as CompanyId;
}

export function companyReadRowToCompanyDTO(row: CompanyReadRow): CompanyDTO {
  return {
    id: row.id,
    businessType: row.businessType,
    clientGeneratedId: row.clientGeneratedId,
    countryId: row.countryId,
    industry: row.industry,
    name: row.name,
    salesOwner: row.salesOwner,
    size: row.size,
    totalRevenue: row.totalRevenue,
    website: row.website ?? null,
  };
}

export function companyDomainToCompanyDTO(company: PersistedCompany): CompanyDTO {
  return {
    id: company.id,
    businessType: company.businessType,
    clientGeneratedId: company.clientGeneratedId,
    countryId: company.countryId,
    industry: company.industry,
    name: company.name,
    salesOwner: company.salesOwner,
    size: company.size,
    totalRevenue: company.totalRevenue,
    website: company.website ?? null,
  };
}

export function companyRowToDomain(row: CompaniesTableSelect): PersistedCompany {
  return Company.rehydrate({
    id: row.id,
    businessType: row.businessType,
    countryId: row.countryId,
    createdAt: row.createdAt,
    industry: row.industry,
    name: row.name,
    salesOwner: row.salesOwner,
    size: row.size,
    totalRevenue: row.totalRevenue,
    website: row.website,
  });
}
