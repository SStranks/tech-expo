/* eslint-disable perfectionist/sort-objects */
import type { UUID as UUIDv4 } from 'node:crypto';

import type { ContactNoteReadRow } from '#Models/query/contact/contacts.read-model.types.js';

import type { NewContact, PersistedContact } from './contact.js';
import type { ContactRepository } from './contact.repository.js';
import type { ContactId } from './contact.types.js';

import { eq, inArray, sql } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import ContactsTable from '#Config/schema/contacts/Contacts.js';
import ContactsNotesTable from '#Config/schema/contacts/ContactsNotes.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { asUserProfileId } from '../user/profile/profile.mapper.js';
import { asContactId, toContactDomain } from './contact.mapper.js';
import { ContactNote, type PersistedContactNote } from './note/note.js';
import { asContactNoteId } from './note/note.mapper.js';

export class PostgresContactRepository implements ContactRepository {
  constructor() {}

  async findContactById(id: ContactId): Promise<PersistedContact | null> {
    return postgresDBCall(async () => {
      const result = await postgresDB.query.ContactsTable.findFirst({
        where: (contact, { eq }) => eq(contact.id, id),
      });

      return result ? toContactDomain(result) : null;
    });
  }

  async save(contact: NewContact | PersistedContact): Promise<PersistedContact> {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (contact.isPersisted()) {
      return await this.update(contact);
    } else {
      return await this.insert(contact);
    }
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

  private async insert(contact: NewContact): Promise<PersistedContact> {
    return postgresDBCall(async () => {
      const [row] = await postgresDB
        .insert(ContactsTable)
        .values({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          company: contact.company,
          jobTitle: contact.jobTitle,
          stage: contact.stage,
          timezone: contact.timezone,
          image: contact.image,
        })
        .returning();

      return toContactDomain(row);
    });
  }

  private async update(contact: PersistedContact): Promise<PersistedContact> {
    return postgresDBCall(async () => {
      let persistedContactNotes: PersistedContactNote[] = [];

      await postgresDB.transaction(async (tx) => {
        if (contact.isRootDirty) {
          tx.update(ContactsTable)
            .set({
              firstName: contact.firstName,
              lastName: contact.lastName,
              email: contact.email,
              phone: contact.phone,
              company: contact.company,
              jobTitle: contact.jobTitle,
              stage: contact.stage,
              timezone: contact.timezone,
              image: contact.image,
            })
            .where(eq(ContactsTable.id, contact.id));
        }

        const { addedNotes, removedNoteIds, updatedNotes } = contact.pullChanges();

        if (addedNotes.length > 0) {
          const valuesSql = sql.join(
            addedNotes.map((note) => sql`(${contact.id}, ${note.content}, ${note.createdBy}, ${note.symbol})`),
            sql`, `
          );

          const insertedNotes: (ContactNoteReadRow & { temp_id: UUIDv4 })[] = await tx.execute(
            sql`
        WITH rows (
          ${ContactsNotesTable.contact},
          ${ContactsNotesTable.note},
          ${ContactsNotesTable.createdBy},
          temp_id
        ) AS (
          VALUES ${valuesSql}
        )
        INSERT INTO ${ContactsNotesTable} (
          ${ContactsNotesTable.contact},
          ${ContactsNotesTable.note},
          ${ContactsNotesTable.createdBy}
        )
        SELECT
          ${ContactsNotesTable.contact},
          ${ContactsNotesTable.note},
          ${ContactsNotesTable.createdBy}
        FROM rows
        RETURNING
          ${ContactsNotesTable.id},
          rows.temp_id;
      `
          );

          persistedContactNotes = insertedNotes.map((row) => {
            return ContactNote.rehydrate({
              id: asContactNoteId(row.id),
              contact: asContactId(row.contact),
              content: row.note,
              createdAt: row.createdAt,
              createdBy: asUserProfileId(row.createdBy),
              symbol: row.temp_id,
            });
          });
        }

        if (removedNoteIds.length > 0) {
          tx.delete(ContactsNotesTable).where(
            inArray(
              ContactsNotesTable.id,
              removedNoteIds.map((id) => id)
            )
          );
        }

        if (updatedNotes.length > 0) {
          for (const note of updatedNotes) {
            await tx.update(ContactsNotesTable).set({ note: note.content }).where(eq(ContactsNotesTable.id, note.id));
          }
        }
      });

      contact.commit(persistedContactNotes);
      return contact;
    });
  }
}
