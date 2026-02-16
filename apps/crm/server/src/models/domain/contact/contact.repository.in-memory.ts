/* eslint-disable perfectionist/sort-objects */
import type { ContactsTableSelect } from '#Config/schema/contacts/Contacts.js';
import type { ContactsNotesTableSelect } from '#Config/schema/contacts/ContactsNotes.js';
import type { ContactNoteReadRow } from '#Models/query/contact/contacts.read-model.types.js';

import type { NewContact, PersistedContact } from './contact.js';
import type { ContactRepository } from './contact.repository.js';
import type { ContactId } from './contact.types.js';
import type { PersistedContactNote } from './note/note.js';

import PostgresError from '#Utils/errors/PostgresError.js';

import { randomUUID } from 'node:crypto';

import { asUserProfileId } from '../user/profile/profile.mapper.js';
import { contactRowToDomain } from './contact.mapper.js';
import { ContactNote } from './note/note.js';
import { asContactNoteId } from './note/note.mapper.js';

export class InMemoryContactRepository implements ContactRepository {
  public contactsMap: Map<string, ContactsTableSelect>;
  public contactNotesMap: Map<string, ContactsNotesTableSelect[]>;

  constructor(seed?: { contacts?: ContactsTableSelect[]; contactsNotes?: ContactsNotesTableSelect[] }) {
    this.contactsMap = new Map<string, ContactsTableSelect>(seed?.contacts?.map((c) => [c.id, c]));
    this.contactNotesMap = (seed?.contactsNotes ?? []).reduce((map, note) => {
      const notes = map.get(note.contactId) ?? [];
      notes.push(note);
      map.set(note.contactId, notes);
      return map;
    }, new Map<string, ContactsNotesTableSelect[]>());
  }

  findContactById(id: ContactId): Promise<PersistedContact | null> {
    const result = this.contactsMap.get(id);
    return Promise.resolve(result ? contactRowToDomain(result) : null);
  }

  async save(company: NewContact | PersistedContact): Promise<PersistedContact> {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (company.isPersisted()) {
      return this.update(company);
    } else {
      return this.insert(company);
    }
  }

  remove(id: ContactId): Promise<ContactId> {
    const contact = this.contactsMap.get(id);

    if (!contact) throw new PostgresError({ kind: 'NOT_FOUND', message: `Company ${id} not found` });

    const deleted = this.contactsMap.delete(id);

    if (!deleted) {
      throw new PostgresError({
        kind: 'INTERNAL_ERROR',
        message: 'Invariant violation: contact not deleted',
      });
    }

    return Promise.resolve(id);
  }

  private insert(contact: NewContact): Promise<PersistedContact> {
    const id = randomUUID();

    if (this.contactsMap.has(id)) {
      throw new PostgresError({
        kind: 'INTERNAL_ERROR',
        message: `Invariant violation: contact ${id} already exists`,
      });
    }

    const row: ContactsTableSelect = {
      id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      companyId: contact.companyId,
      jobTitle: contact.jobTitle,
      stage: contact.stage,
      timezoneId: contact.timezoneId,
      image: contact.image,
      createdAt: new Date(),
    };

    this.contactsMap.set(id, row);

    return Promise.resolve(contactRowToDomain(row));
  }

  private update(contact: PersistedContact): Promise<PersistedContact> {
    const existingContact = this.contactsMap.get(contact.id);

    if (!existingContact) {
      throw new PostgresError({
        kind: 'NOT_FOUND',
        message: `Contact ${contact.id} not found`,
      });
    }

    if (contact.isRootDirty) {
      const updatedContact: ContactsTableSelect = {
        ...existingContact,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        companyId: contact.companyId,
        jobTitle: contact.jobTitle,
        stage: contact.stage,
        timezoneId: contact.timezoneId,
        image: contact.image,
      };

      this.contactsMap.set(contact.id, updatedContact);
    }

    const { addedNotes, removedNoteIds, updatedNotes } = contact.pullChanges();

    const persistedContactNotes: PersistedContactNote[] = [];

    const existingNotes = this.contactNotesMap.get(contact.id) ?? [];

    if (addedNotes.length > 0) {
      for (const note of addedNotes) {
        const persistedNote: ContactNoteReadRow = {
          id: asContactNoteId(randomUUID()),
          contactId: contact.id,
          note: note.content,
          createdByUserProfileId: note.createdByUserProfileId,
          createdAt: new Date(),
        };

        existingNotes.push(persistedNote);

        persistedContactNotes.push(
          ContactNote.rehydrate({
            id: asContactNoteId(persistedNote.id),
            contactId: contact.id,
            content: persistedNote.note,
            createdAt: persistedNote.createdAt,
            createdByUserProfileId: asUserProfileId(persistedNote.createdByUserProfileId),
            symbol: note.symbol,
          })
        );
      }
    }

    if (removedNoteIds.length > 0) {
      for (const id of removedNoteIds) {
        const index = existingNotes.findIndex((n) => n.id === id);
        if (index !== -1) existingNotes.splice(index, 1);
      }
    }

    if (updatedNotes.length > 0) {
      for (const note of updatedNotes) {
        const existing = existingNotes.find((n) => n.id === note.id);
        if (existing) {
          existing.note = note.content;
        }
      }
    }

    this.contactNotesMap.set(contact.id, existingNotes);

    contact.commit(persistedContactNotes);

    return Promise.resolve(contact);
  }
}
