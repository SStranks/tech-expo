import type { ContactSortableField, SortDirection } from '#Graphql/generated/graphql.gen.js';
import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactClientGeneratedId, ContactId, ContactStage } from '#Models/domain/contact/contact.types.js';
import type { ContactNoteClientGeneratedId, ContactNoteId } from '#Models/domain/contact/note/note.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { PaginationInput, PaginationResult } from '#Types/graphql.js';

import type { CompanyReadRow } from '../company/companies.read-model.types.js';

export type ContactReadRow = {
  id: ContactId;
  clientGeneratedId: ContactClientGeneratedId;
  companyId: CompanyId;
  email: string;
  firstName: string;
  image: string | null;
  jobTitle: string;
  lastName: string;
  phone: string;
  stage: ContactStage;
  timezoneId: TimeZoneId | null;
};

export type ContactOverviewReadRow = {
  id: ContactId;
  company: CompanyReadRow;
  email: string;
  firstName: string;
  jobTitle: string;
  lastName: string;
  stage: ContactStage;
};

export type ContactNoteReadRow = {
  id: ContactNoteId;
  clientGeneratedId: ContactNoteClientGeneratedId;
  contactId: ContactId;
  createdAt: Date;
  createdByUserProfileId: UserProfileId;
  note: string;
};

export type ContactQuery = {
  companyId?: CompanyId;
  stage?: ContactStage;
  timezoneId?: TimeZoneId;
};

export type PaginatedCompanyContactsQuery = {
  companyId: CompanyId;
  pagination: PaginationInput;
};

export type PaginatedCompanyContacts = PaginationResult<ContactReadRow>;

export type ContactFilters = {
  companyId?: CompanyId;
  searchContactEmail?: string;
  searchContactJobTitle?: string;
  searchContactName?: string;
  searchContactStage?: ContactStage;
};

export type ContactSort = {
  direction: SortDirection;
  field: ContactSortableField;
}[];

export type ContactsOverviewQuery = {
  filters: ContactFilters;
  pagination: PaginationInput;
  sort: ContactSort;
};

export type ContactsOverviewPaginated = PaginationResult<ContactOverviewReadRow>;
