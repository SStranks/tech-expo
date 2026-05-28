import type { BusinessType, CompanyId, CompanySize } from '#Models/domain/company/company.types.js';
import type { CompanyNoteClientGeneratedId, CompanyNoteId } from '#Models/domain/company/note/note.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { CountryId } from '#Models/domain/country/country.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { PaginationInput, PaginationResult } from '#Types/graphql.js';

import type { ContactReadRow } from '../contact/contacts.read-model.types.js';
import type { PipelineDealReadRow } from '../pipeline/pipeline.read-model.types.js';
import type { QuoteReadRow } from '../quote/quotes.read-model.types.js';

export type CompanyReadRow = {
  id: CompanyId;
  businessType: BusinessType;
  countryId: CountryId;
  industry: string;
  name: string;
  salesOwner: UserProfileId;
  size: CompanySize;
  totalRevenue: string | null;
  website: string | null;
};

export type CompanyOverviewReadRow = {
  id: CompanyId;
  name: string;
  openDealsAmount: string;
  owner: { id: UserProfileId; firstName: string; image: string | null; lastName: string };
  relatedContacts: { id: ContactId; firstName: string; image: string | null; lastName: string }[];
};

export type CompanyNoteReadRow = {
  id: CompanyNoteId;
  companyId: CompanyId;
  createdAt: Date;
  createdByUserProfileId: UserProfileId;
  note: string;
  clientTemporaryId?: CompanyNoteClientGeneratedId;
};

export type CompanyQuery = {
  businessType?: BusinessType;
  countryId?: CountryId;
  industry?: string;
  size?: CompanySize;
};

export type CompanyFilters = Partial<{
  contactIds: ContactId[];
  salesOwnerId: UserProfileId;
  searchCompanyName: string;
}>;

export type CompaniesOverviewQuery = {
  filters: CompanyFilters;
  pagination: PaginationInput;
};

export type CompaniesOverviewPaginated = PaginationResult<CompanyOverviewReadRow>;

export type PaginatedCompanyDealsQuery = {
  companyId: CompanyId;
  pagination: PaginationInput;
};
export type PaginatedCompanyPipelineDeals = PaginationResult<CompanyPipelineDealSummaryReadRow>;
export type CompanyPipelineDealSummaryReadRow = Pick<PipelineDealReadRow, 'id' | 'title' | 'stageId' | 'value'> & {
  dealContact: {
    id: ContactId;
    firstName: string;
    lastName: string;
  };
  dealOwner: {
    id: UserProfileId;
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
  preparedBy: {
    id: UserProfileId;
    firstName: string;
    image: string;
    lastName: string;
  };
  preparedFor: {
    id: ContactId;
    firstName: string;
    image: string;
    lastName: string;
  };
};
