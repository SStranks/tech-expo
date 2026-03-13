/* eslint-disable perfectionist/sort-objects */
import type { PostgresTransaction } from '#Config/dbPostgres.js';
import type { ContactsNotesTableInsert } from '#Config/schema/contacts/ContactsNotes.js';

import type { ContactRepository } from './contact.repository.js';
import type { ContactId } from './contact.types.js';

import { eq, inArray } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import ContactsTable from '#Config/schema/contacts/Contacts.js';
import ContactsNotesTable from '#Config/schema/contacts/ContactsNotes.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { Contact, type NewContact, type PersistedContact } from './contact.js';
import { asContactId, contactRowToDomain } from './contact.mapper.js';
import { ContactNote, type PersistedContactNote } from './note/note.js';
import { asContactNoteId } from './note/note.mapper.js';

export class PostgresContactRepository implements ContactRepository {
  constructor() {}

  async findContactById(id: ContactId): Promise<PersistedContact | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.ContactsTable.findFirst({
        where: (contact, { eq }) => eq(contact.id, id),
      });

      return result ? contactRowToDomain(result) : null;
    });
  }

  async save(contact: NewContact | PersistedContact): Promise<PersistedContact> {
    return postgresDBCall(async () => {
      const persistedContact = await postgresDB.transaction(async (tx) => {
        const persistedContact = contact.isPersisted() ? contact : await this.insert(tx, contact);

        if (persistedContact.hasDirtyFields()) await this.update(tx, persistedContact);

        await this.syncNotes(tx, persistedContact);

        persistedContact.commit();
        return persistedContact;
      });

      return persistedContact;
    });
  }

  async remove(id: ContactId): Promise<ContactId> {
    return postgresDBCall(async () => {
      const result = await postgresDB
        .delete(ContactsTable)
        .where(eq(ContactsTable.id, id))
        .returning({ id: ContactsTable.id });

      if (result.length === 0) throw new PostgresError({ kind: 'NOT_FOUND', message: `Contact ${id} not found` });
      if (result.length > 1)
        throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Invariant violation: multiple companies deleted' });

      return asContactId(result[0].id);
    });
  }

  private async insert(tx: PostgresTransaction, contact: NewContact): Promise<PersistedContact> {
    return postgresDBCall(async () => {
      const [row] = await tx
        .insert(ContactsTable)
        .values({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          companyId: contact.companyId,
          jobTitle: contact.jobTitle,
          stage: contact.stage,
          timezoneId: contact.timezoneId,
          image: contact.image,
        })
        .returning();

      return Contact.promote(contact, { id: asContactId(row.id), createdAt: row.createdAt });
    });
  }

  private async update(tx: PostgresTransaction, contact: PersistedContact): Promise<PersistedContact> {
    await tx.update(ContactsTable).set(contact.pullDirtyFields()).where(eq(ContactsTable.id, contact.id));
    return contact;
  }

  private async syncNotes(tx: PostgresTransaction, contact: PersistedContact) {
    const { addedNotes, removedNoteIds, updatedNotes } = contact.pullNoteChanges();
    let persistedNotes: PersistedContactNote[] = [];

    if (addedNotes.size > 0) {
      const rows = await tx
        .insert(ContactsNotesTable)
        .values(
          [...addedNotes.values()].map(
            (n): ContactsNotesTableInsert => ({
              contactId: n.contactId,
              createdByUserProfileId: n.createdByUserProfileId,
              clientTemporaryId: n.clientId,
              note: n.content,
            })
          )
        )
        .returning();

      persistedNotes = rows.map((row) => {
        const tempId = row.clientTemporaryId;
        if (!tempId) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: 'Inserted contact-note missing clientTemporaryId',
          });
        }

        const note = addedNotes.get(tempId);
        if (!note) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: `No contact-note found for temporary id ${tempId}`,
          });
        }

        return ContactNote.promote(note, {
          id: asContactNoteId(row.id),
          createdAt: row.createdAt,
        });
      });
    }

    if (removedNoteIds.size > 0) {
      await tx.delete(ContactsNotesTable).where(inArray(ContactsNotesTable.id, [...removedNoteIds]));
    }

    if (updatedNotes.size > 0) {
      for (const [UUID, note] of updatedNotes) {
        await tx.update(ContactsNotesTable).set(note.pullDirtyFields()).where(eq(ContactsNotesTable.id, UUID));
      }
    }

    contact.commitNotes(persistedNotes);
  }
}
