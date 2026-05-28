import type { QuoteSortableField, SortDirection } from '#Graphql/generated/graphql.gen.js';
import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { QuoteNoteClientGeneratedId, QuoteNoteId } from '#Models/domain/quote/note/note.types.js';
import type { QuoteClientGeneratedId, QuoteId, QuoteStage } from '#Models/domain/quote/quote.types.js';
import type { QuoteServiceClientGeneratedId, QuoteServiceId } from '#Models/domain/quote/service/service.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { PaginationInput, PaginationResult } from '#Types/graphql.js';

export type QuoteReadRow = {
  id: QuoteId;
  clientGeneratedId: QuoteClientGeneratedId;
  title: string;
  companyId: CompanyId;
  totalAmount: string;
  salesTax: string;
  stage: QuoteStage;
  preparedForContactId: ContactId;
  preparedByUserProfileId: UserProfileId;
  issuedAt: Date | null;
  dueAt: Date | null;
  createdAt: Date;
};

export type QuoteNoteReadRow = {
  id: QuoteNoteId;
  clientGeneratedId: QuoteNoteClientGeneratedId;
  note: string;
  quoteId: QuoteId;
  createdAt: Date;
  createdByUserProfileId: UserProfileId;
};

export type QuoteServiceReadRow = {
  id: QuoteServiceId;
  clientGeneratedId: QuoteServiceClientGeneratedId;
  title: string;
  price: string;
  quantity: number;
  discount: string;
  totalAmount: string;
  quoteId: QuoteId;
  createdAt: Date;
};

export type QuoteOverviewReadRow = {
  id: QuoteId;
  title: string;
  company: { id: CompanyId; name: string; logo: string | null };
  total: string;
  stage: QuoteStage;
  preparedFor: { id: ContactId; firstName: string; lastName: string; image: string | null };
  preparedBy: { id: UserProfileId; firstName: string; lastName: string; image: string | null };
  createdAt: Date;
};

export type QuotesOverviewQuery = {
  filters: QuoteOverviewQueryFilters;
  sort: QuoteOverviewQuerySort;
  pagination: PaginationInput;
};

export type QuoteOverviewQueryFilters = Partial<{
  searchCompanyById: CompanyId;
  searchPreparedByUserProfileId: UserProfileId;
  searchQuoteTitle: string;
  searchStage: QuoteStage;
}>;

export type QuoteOverviewQuerySort = {
  field: QuoteSortableField;
  direction?: SortDirection;
}[];

export type QuotesOverviewPaginated = PaginationResult<QuoteOverviewReadRow>;
