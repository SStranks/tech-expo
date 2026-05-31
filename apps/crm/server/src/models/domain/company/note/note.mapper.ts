import type { UUID } from '@apps/crm-shared';

import type { CompaniesNotesTableSelect } from '#Config/schema/companies/CompanyNotes.js';
import type { CompanyNoteReadRow } from '#Models/query/company/companies.read-model.types.js';

import type { CompanyNoteDTO } from './note.dto.js';
import type { CompanyNoteId } from './note.types.js';

import { CompanyNote, type PersistedCompanyNote } from './note.js';

export function asCompanyNoteId(id: UUID): CompanyNoteId {
  return id as CompanyNoteId;
}

export function companyNoteReadRowToCompanyNoteDTO(companyNote: CompanyNoteReadRow): CompanyNoteDTO {
  return {
    id: companyNote.id,
    clientGeneratedId: companyNote.clientGeneratedId,
    createdAt: companyNote.createdAt,
    createdByUserProfileId: companyNote.createdByUserProfileId,
    note: companyNote.note,
  };
}

export function companyNoteDomainToCompanyNoteDTO(companyNote: PersistedCompanyNote): CompanyNoteDTO {
  return {
    id: companyNote.id,
    clientGeneratedId: companyNote.clientGeneratedId,
    createdAt: companyNote.createdAt,
    createdByUserProfileId: companyNote.createdByUserProfileId,
    note: companyNote.content,
  };
}

export function companyNoteRowToDomain(row: CompaniesNotesTableSelect): PersistedCompanyNote {
  return CompanyNote.rehydrate({
    id: row.id,
    companyId: row.companyId,
    content: row.note,
    createdAt: row.createdAt,
    createdByUserProfileId: row.createdByUserProfileId,
  });
}
