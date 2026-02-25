import type { UUID } from '@apps/crm-shared';

import type { PersistedContactNote } from '#Models/domain/contact/note/note.js';

import type {
  ContactNoteReadRow,
  ContactQuery,
  ContactReadRow,
  ContactsOverviewPaginated,
  ContactsOverviewQuery,
} from './contacts.read-model.types.js';

export interface ContactReadModel {
  count(query?: ContactQuery): Promise<number>;
  findContactsByIds(ids: UUID[]): Promise<ContactReadRow[]>;
  findContactOverview(query: ContactsOverviewQuery): Promise<ContactsOverviewPaginated>;
  findContactNoteByContactNoteId(id: UUID): Promise<PersistedContactNote | null>;
  findContactNotesByContactId(id: UUID): Promise<ContactNoteReadRow[]>;
}
