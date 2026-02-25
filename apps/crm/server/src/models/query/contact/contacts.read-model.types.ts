import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId, ContactStage } from '#Models/domain/contact/contact.types.js';
import type { ContactNoteId } from '#Models/domain/contact/note/note.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { PaginationInput, PaginationResult } from '#Types/graphql.js';

import type { CompanyReadRow } from '../company/companies.read-model.types.js';

export type ContactReadRow = {
  id: ContactId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: CompanyId;
  jobTitle: string;
  stage: ContactStage;
  timezoneId: TimeZoneId | null;
  image: string | null;
};

export type ContactOverviewReadRow = {
  id: ContactId;
  firstName: string;
  lastName: string;
  email: string;
  company: CompanyReadRow;
  jobTitle: string;
  stage: ContactStage;
};

export type ContactNoteReadRow = {
  id: ContactNoteId;
  note: string;
  contactId: ContactId;
  createdAt: Date;
  createdByUserProfileId: UserProfileId;
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
  searchContactName?: string;
  searchContactEmail?: string;
  searchContactJobTitle?: string;
  searchContactStage?: ContactStage;
  companyId?: CompanyId;
};

export type ContactsOverviewQuery = {
  filters: ContactFilters;
  pagination: PaginationInput;
};

export type ContactsOverviewPaginated = PaginationResult<ContactOverviewReadRow>;
