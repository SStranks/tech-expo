/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import type { CompaniesNotesTableSelect } from '#Config/schema/companies/CompanyNotes.js';

export type CompanyNotesDTO = {
  id: UUID;
  note: string;
  company: UUID;
  createdBy: UUID;
  createdAt: Date;
};

export const toCompanyNoteDTO = (companyNote: CompaniesNotesTableSelect): CompanyNotesDTO => ({
  id: companyNote.id,
  note: companyNote.note,
  company: companyNote.company,
  createdBy: companyNote.createdBy,
  createdAt: companyNote.createdAt,
});
