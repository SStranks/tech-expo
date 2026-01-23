/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CompanyNoteReadRow } from '#Models/query/company/companies.read-model.types.js';

import type { CompanyNoteDTO } from './note.dto.js';
import type { PersistedCompanyNote } from './note.js';
import type { CompanyNoteId } from './note.types.js';

export function asCompanyNoteId(id: UUID): CompanyNoteId {
  return id as CompanyNoteId;
}

export function companyNoteReadRowToDTO(companyNote: CompanyNoteReadRow): CompanyNoteDTO {
  return {
    id: companyNote.id,
    note: companyNote.note,
    createdByUserProfileId: companyNote.createdByUserProfileId,
    createdAt: companyNote.createdAt,
  };
}

export function companyNoteDomainToDTO(note: PersistedCompanyNote): CompanyNoteDTO {
  return {
    id: note.id,
    note: note.content,
    createdAt: note.createdAt,
    createdByUserProfileId: note.createdByUserProfileId,
  };
}
