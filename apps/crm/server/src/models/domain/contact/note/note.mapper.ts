/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { ContactNoteReadRow } from '#Models/query/contact/contacts.read-model.types.js';

import type { ContactNoteDTO } from './note.dto.js';
import type { PersistedContactNote } from './note.js';
import type { ContactNoteId } from './note.types.js';

export function asContactNoteId(id: UUID): ContactNoteId {
  return id as ContactNoteId;
}

export function contactNoteReadRowToContactNoteDTO(contactNote: ContactNoteReadRow): ContactNoteDTO {
  return {
    id: contactNote.id,
    note: contactNote.note,
    createdByUserProfileId: contactNote.createdByUserProfileId,
    createdAt: contactNote.createdAt,
  };
}

export function contactNoteDomainToContactNoteDTO(contactNote: PersistedContactNote): ContactNoteDTO {
  return {
    id: contactNote.id,
    note: contactNote.content,
    createdAt: contactNote.createdAt,
    createdByUserProfileId: contactNote.createdByUserProfileId,
  };
}
