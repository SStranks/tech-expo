/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import type { ContactsNotesTableSelect } from '#Config/schema/contacts/ContactsNotes.js';
import type { ContactNoteReadRow } from '#Models/query/contact/contacts.read-model.types.js';

import type { ContactNoteDTO } from './note.dto.js';
import type { ContactNoteId } from './note.types.js';

import { ContactNote, type PersistedContactNote } from './note.js';

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

export function contactNoteRowToDomain(row: ContactsNotesTableSelect): PersistedContactNote {
  return ContactNote.rehydrate({
    id: row.id,
    content: row.note,
    contactId: row.contactId,
    createdAt: row.createdAt,
    createdByUserProfileId: row.createdByUserProfileId,
  });
}
