/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { CompaniesNotesTableSelect } from '#Config/schema/companies/CompanyNotes.js';
import type { CompanyNoteReadRow } from '#Models/query/company/companies.read-model.types.js';

import type { CompanyNoteDTO } from './note.dto.js';
import type { CompanyNoteId } from './note.types.js';

import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';

import { asCompanyId } from '../company.mapper.js';
import { CompanyNote, type PersistedCompanyNote } from './note.js';

export function asCompanyNoteId(id: UUID): CompanyNoteId {
  return id as CompanyNoteId;
}

export function companyNoteReadRowToCompanyDTO(companyNote: CompanyNoteReadRow): CompanyNoteDTO {
  return {
    id: companyNote.id,
    note: companyNote.note,
    createdByUserProfileId: companyNote.createdByUserProfileId,
    createdAt: companyNote.createdAt,
  };
}

export function companyNoteDomainToCompanyNoteDTO(companyNote: PersistedCompanyNote): CompanyNoteDTO {
  return {
    id: companyNote.id,
    note: companyNote.content,
    createdAt: companyNote.createdAt,
    createdByUserProfileId: companyNote.createdByUserProfileId,
  };
}

export function companyNoteRowToDomain(row: CompaniesNotesTableSelect): PersistedCompanyNote {
  return CompanyNote.rehydrate({
    id: asCompanyNoteId(row.id),
    content: row.note,
    companyId: asCompanyId(row.companyId),
    createdAt: row.createdAt,
    createdByUserProfileId: asUserProfileId(row.createdByUserProfileId),
  });
}
