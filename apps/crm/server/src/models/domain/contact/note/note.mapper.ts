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
    clientGeneratedId: contactNote.clientGeneratedId,
    createdAt: contactNote.createdAt,
    createdByUserProfileId: contactNote.createdByUserProfileId,
    note: contactNote.note,
  };
}

export function contactNoteDomainToContactNoteDTO(contactNote: PersistedContactNote): ContactNoteDTO {
  return {
    id: contactNote.id,
    clientGeneratedId: contactNote.clientGeneratedId,
    createdAt: contactNote.createdAt,
    createdByUserProfileId: contactNote.createdByUserProfileId,
    note: contactNote.content,
  };
}

export function contactNoteRowToDomain(row: ContactsNotesTableSelect): PersistedContactNote {
  return ContactNote.rehydrate({
    id: row.id,
    contactId: row.contactId,
    content: row.note,
    createdAt: row.createdAt,
    createdByUserProfileId: row.createdByUserProfileId,
  });
}
