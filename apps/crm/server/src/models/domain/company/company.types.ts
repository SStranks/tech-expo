import type { UUID } from '@apps/crm-shared';

import type { CountryId } from '../country/country.types.js';
import type { PersistedCompany } from './company.js';
import type { PersistedCompanyNote } from './note/note.js';
import type { CompanyNoteId } from './note/note.types.js';

export const BUSINESS_TYPE = ['B2B', 'B2C'] as const;
export const COMPANY_SIZE = ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'] as const;

export type CompanySize = (typeof COMPANY_SIZE)[number];
export type BusinessType = (typeof BUSINESS_TYPE)[number];

export type CompanyId = UUID & { readonly __companyId: unique symbol };

export type CreateCompanyCommand = {
  name: string;
  size: CompanySize;
  industry: string;
  businessType: BusinessType;
  countryId: string;
  totalRevenue?: string;
  website?: string;
  createdAt?: Date;
};

export type UpdateCompanyCommand = {
  id: CompanyId;
  name?: string;
  size?: CompanySize;
  industry?: string;
  businessType?: BusinessType;
  country?: CountryId;
  totalRevenue?: string;
  website?: string;
  createdAt?: Date;
  addNotes?: { body: string }[];
  removeNotesIds?: CompanyNoteId[];
};

export type AddCompanyNoteCommand = {
  companyId: CompanyId;
  note: string;
};

export type AddCompanyNoteReturn = { company: PersistedCompany; companyNote: PersistedCompanyNote };
export type UpdateCompanyNoteReturn = { company: PersistedCompany; companyNote: PersistedCompanyNote };

export type UpdateCompanyNoteCommand = {
  companyId: CompanyId;
  companyNoteId: CompanyNoteId;
  note: string;
};

export type RemoveCompanyNoteCommand = {
  companyId: CompanyId;
  companyNoteId: CompanyNoteId;
};
