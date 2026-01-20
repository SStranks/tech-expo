/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';
import type { CompaniesNotesTableSelect } from '#Config/schema/companies/CompanyNotes.js';
import type { CompanyReadRow } from '#Models/query/company/companies.read-model.types.js';

import type { CompanyDTO } from './company.dto.js';
import type { PersistedCompany } from './company.js';
import type { CompanyId } from './company.types.js';
import type { PersistedCompanyNote } from './note/note.js';

import { asCountryId } from '#Models/domain/country/country.mapper.js';

import { asUserProfileId } from '../user/profile/profile.mapper.js';
import { Company } from './company.js';
import { CompanyNote } from './note/note.js';
import { asCompanyNoteId } from './note/note.mapper.js';

export function asCompanyId(id: UUID): CompanyId {
  return id as CompanyId;
}

export function companyReadRowToDTO(row: CompanyReadRow): CompanyDTO {
  return {
    id: row.id,
    name: row.name,
    businessType: row.businessType,
    country: row.country,
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
    country: company.country,
    industry: company.industry,
    size: company.size,
    totalRevenue: company.totalRevenue,
    website: company.website ?? null,
  };
}

export function toCompanyDomain(row: CompaniesTableSelect): PersistedCompany {
  return Company.rehydrate({
    id: asCompanyId(row.id),
    name: row.name,
    size: row.size,
    totalRevenue: row.totalRevenue,
    industry: row.industry,
    businessType: row.businessType,
    country: asCountryId(row.country),
    website: row.website ?? undefined,
    createdAt: row.createdAt,
  });
}

export function toCompanyNoteDomain(row: CompaniesNotesTableSelect): PersistedCompanyNote {
  return CompanyNote.rehydrate({
    id: asCompanyNoteId(row.id),
    content: row.note,
    company: asCompanyId(row.company),
    createdAt: row.createdAt,
    createdBy: asUserProfileId(row.createdBy),
  });
}
