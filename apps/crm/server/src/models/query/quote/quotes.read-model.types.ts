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
  companyId: CompanyId;
  createdAt: Date;
  dueAt: Date | null;
  issuedAt: Date | null;
  preparedByUserProfileId: UserProfileId;
  preparedForContactId: ContactId;
  salesTax: string;
  stage: QuoteStage;
  title: string;
  totalAmount: string;
};

export type QuoteNoteReadRow = {
  id: QuoteNoteId;
  clientGeneratedId: QuoteNoteClientGeneratedId;
  content: string;
  createdAt: Date;
  quoteId: QuoteId;
};

export type QuoteServiceReadRow = {
  id: QuoteServiceId;
  clientGeneratedId: QuoteServiceClientGeneratedId;
  createdAt: Date;
  discount: string;
  price: string;
  quantity: number;
  quoteId: QuoteId;
  title: string;
  totalAmount: string;
};

export type QuoteOverviewReadRow = {
  id: QuoteId;
  company: { id: CompanyId; logo: string | null; name: string };
  createdAt: Date;
  preparedBy: { id: UserProfileId; firstName: string; image: string | null; lastName: string };
  preparedFor: { id: ContactId; firstName: string; image: string | null; lastName: string };
  stage: QuoteStage;
  title: string;
  total: string;
};

export type QuotesOverviewQuery = {
  filters: QuoteOverviewQueryFilters;
  pagination: PaginationInput;
  sort: QuoteOverviewQuerySort;
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
