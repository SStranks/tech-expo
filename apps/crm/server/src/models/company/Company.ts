import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { CompaniesTableSelect } from '#Config/schema/companies/Companies.js';
import type { CompaniesNotesTableSelect } from '#Config/schema/companies/CompanyNotes.js';
import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { PipelineTableSelect } from '#Config/schema/pipeline/Pipeline.js';
import type { QuotesTableSelect } from '#Config/schema/quotes/Quotes.js';
import type { UserProfileTableSelect } from '#Config/schema/user/UserProfile.js';
import type { ContactDTO } from '#Models/contact/Contact.js';
import type { PipelineDealDTO } from '#Models/pipeline/Pipeline.js';
import type { QuoteDTO } from '#Models/quote/Quote.js';
import type { Paginated } from '#Types/graphql.js';

import type { CompanyNotesDTO } from './CompanyNotes.js';

export type CompanySize = (typeof COMPANY_SIZE)[number];
export const COMPANY_SIZE = ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'] as const;
export type BusinessType = (typeof BUSINESS_TYPE)[number];
export const BUSINESS_TYPE = ['B2B', 'B2C'] as const;

export type CompanyDTO = {
  id: UUID;
  name: string;
  size: CompanySize;
  totalRevenue: number;
  industry: string;
  businessType: BusinessType;
  country: UUID;
  website: string | null;
};

export type CompanyOverviewDTO = CompanyDTO & {
  contacts: ContactDTO[];
  salesOwner: UUID;
};

export type CompanyDetailedDTO = CompanyDTO & {
  salesOwner: UUID;
  contacts: ContactDTO[];
  deals: PipelineDealDTO[];
  quotes: QuoteDTO[];
  notes: CompanyNotesDTO[];
};

export const toCompanyDTO = (company: CompaniesTableSelect): CompanyDTO => ({
  id: company.id,
  name: company.name,
  businessType: company.businessType,
  country: company.country,
  industry: company.industry,
  size: company.size,
  totalRevenue: company.totalRevenue,
  website: company.website,
});

// export const toCompanyWithRelationsDTO = (company: CompanyWithRelations): CompanyDetailedDTO => ({});

export interface CompanyFilters {
  search?: string;
  salesOwnerId?: UUID;
  contactIds?: UUID[];
}

export interface CompanyQuery {
  filters: CompanyFilters;
  pagination: {
    limit: number;
    offset: number;
  };
}

export interface CompanyWithRelations {
  company: CompaniesTableSelect;
  salesOwner?: UserProfileTableSelect;
  contacts: ContactsTableSelect[];
}

export type CompanyDetailed = CompaniesTableSelect & {
  contacts?: CompanyPaginatedContacts;
  deals?: CompanyPaginatedDeals;
  quotes?: CompanyPaginatedQuotes;
  notes?: CompaniesNotesTableSelect[];
  salesOwner?: string;
};

type CompanyPaginatedContacts = Paginated<ContactsTableSelect>;
type CompanyPaginatedDeals = Paginated<PipelineTableSelect>;
type CompanyPaginatedQuotes = Paginated<QuotesTableSelect>;
