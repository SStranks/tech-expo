import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { PersistedContactNote } from '#Models/domain/contact/note/note.js';
import type { ContactNoteId } from '#Models/domain/contact/note/note.types.js';

import type {
  ContactNoteReadRow,
  ContactQuery,
  ContactReadRow,
  ContactsOverviewPaginated,
  ContactsOverviewQuery,
} from './contacts.read-model.types.js';

export interface ContactReadModel {
  count(query?: ContactQuery): Promise<number>;
  findContactsByIds(ids: ContactId[]): Promise<ContactReadRow[]>;
  findContactOverview(query: ContactsOverviewQuery): Promise<ContactsOverviewPaginated>;
  findContactNoteByContactNoteId(id: ContactNoteId): Promise<PersistedContactNote | null>;
  findContactNotesByContactId(id: ContactId): Promise<ContactNoteReadRow[]>;
}
