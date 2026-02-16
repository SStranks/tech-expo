/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';
import type { CompanyReadRow } from '#Models/query/company/companies.read-model.types.js';

import type { CompanyDTO } from './company.dto.js';
import type { PersistedCompany } from './company.js';
import type { CompanyId } from './company.types.js';

import { asCountryId } from '#Models/domain/country/country.mapper.js';

import { Company } from './company.js';

export function asCompanyId(id: UUID): CompanyId {
  return id as CompanyId;
}

export function companyReadRowToCompanyDTO(row: CompanyReadRow): CompanyDTO {
  return {
    id: row.id,
    name: row.name,
    businessType: row.businessType,
    countryId: row.countryId,
    industry: row.industry,
    size: row.size,
    totalRevenue: row.totalRevenue,
    website: row.website ?? null,
  };
}

export function companyDomainToCompanyDTO(company: PersistedCompany): CompanyDTO {
  return {
    id: company.id,
    name: company.name,
    businessType: company.businessType,
    countryId: company.countryId,
    industry: company.industry,
    size: company.size,
    totalRevenue: company.totalRevenue,
    website: company.website ?? null,
  };
}

export function companyRowToDomain(row: CompaniesTableSelect): PersistedCompany {
  return Company.rehydrate({
    id: asCompanyId(row.id),
    name: row.name,
    size: row.size,
    totalRevenue: row.totalRevenue,
    industry: row.industry,
    businessType: row.businessType,
    countryId: asCountryId(row.countryId),
    website: row.website ?? undefined,
    createdAt: row.createdAt,
  });
}
