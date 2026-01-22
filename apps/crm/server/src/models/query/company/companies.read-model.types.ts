import type { UUID } from '@apps/crm-shared';

import type { BusinessType, CompanyId, CompanySize } from '#Models/domain/company/company.types.js';
import type { CompanyNoteId } from '#Models/domain/company/note/note.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { CountryId } from '#Models/domain/country/country.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { PaginationInput, PaginationResult } from '#Types/graphql.js';

import type { ContactReadRow } from '../contact/contacts.read-model.types.js';
import type { PipelineDealReadRow } from '../pipeline/pipeline.read-model.types.js';
import type { QuoteReadRow } from '../quote/quotes.read-model.types.js';

export type CompanyReadRow = {
  id: CompanyId;
  name: string;
  size: CompanySize;
  totalRevenue: string;
  industry: string;
  businessType: BusinessType;
  country: CountryId;
  website: string | null;
};

export type CompaniesOverviewReadRow = {
  id: CompanyId;
  name: string;
  owner: { id: UserProfileId; firstName: string; lastName: string; image: string | null };
  openDealsAmount: string;
  relatedContacts: { id: ContactId; firstName: string; lastName: string; image: string | null }[];
};

export type CompanyNoteReadRow = {
  id: CompanyNoteId;
  note: string;
  company: CompanyId;
  createdAt: Date;
  createdBy: UserProfileId;
};

export type CompanyQuery = {
  businessType?: BusinessType;
  country?: CountryId;
  industry?: string;
  size?: CompanySize;
};

export type CompanyFilters = {
  searchCompanyName?: string;
  salesOwnerId?: UserProfileId;
  contactIds?: ContactId[];
};

export type CompaniesOverviewQuery = {
  filters: CompanyFilters;
  pagination: PaginationInput;
};

export type CompaniesOverviewPaginated = PaginationResult<CompaniesOverviewReadRow>;

export type PaginatedCompanyDealsQuery = {
  companyId: CompanyId;
  pagination: PaginationInput;
};
export type PaginatedCompanyPipelineDeals = PaginationResult<CompanyPipelineDealSummaryReadRow>;
export type CompanyPipelineDealSummaryReadRow = Pick<PipelineDealReadRow, 'id' | 'title' | 'stage' | 'value'> & {
  dealOwner: {
    id: UUID;
    firstName: string;
    lastName: string;
  };
  dealContact: {
    id: UUID;
    firstName: string;
    lastName: string;
  };
};

export type PaginatedCompanyContactsQuery = {
  companyId: CompanyId;
  pagination: PaginationInput;
};
export type PaginatedCompanyContacts = PaginationResult<CompanyContactSummaryReadRow>;
export type CompanyContactSummaryReadRow = Pick<
  ContactReadRow,
  'id' | 'firstName' | 'lastName' | 'jobTitle' | 'stage' | 'image'
>;

export type PaginatedCompanyQuotesQuery = {
  companyId: CompanyId;
  pagination: PaginationInput;
};
export type PaginatedCompanyQuotes = PaginationResult<CompanyQuoteSummaryReadRow>;
export type CompanyQuoteSummaryReadRow = Pick<QuoteReadRow, 'id' | 'title' | 'totalAmount' | 'stage'> & {
  preparedFor: {
    id: UUID;
    firstName: string;
    lastName: string;
    image: string;
  };
  preparedBy: {
    id: UUID;
    firstName: string;
    lastName: string;
    image: string;
  };
};
