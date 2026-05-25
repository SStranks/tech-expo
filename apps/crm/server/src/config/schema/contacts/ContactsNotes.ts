import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { ContactNoteClientGeneratedId, ContactNoteId } from '#Models/domain/contact/note/note.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import UserProfileTable from '../user/UserProfile.js';
import ContactsTable from './Contacts.js';

// ---------- TABLES -------- //
export type ContactsNotesTableInsert = InferInsertModel<typeof ContactsNotesTable>;
export type ContactsNotesTableSelect = InferSelectModel<typeof ContactsNotesTable>;
export type ContactsNotesTableUpdate = Partial<Omit<ContactsNotesTableInsert, 'id'>>;
export const ContactsNotesTable = pgTable('contacts_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<ContactNoteId>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<ContactNoteClientGeneratedId>(),
  note: text('note_text').notNull(),
  contactId: uuid('contact_id')
    .references(() => ContactsTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<ContactId>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdByUserProfileId: uuid('created_by_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UserProfileId>(),
});

// -------- RELATIONS ------- //
export const ContactsNotesTableeRelations = relations(ContactsNotesTable, ({ one }) => {
  return {
    contact: one(ContactsTable, {
      fields: [ContactsNotesTable.contactId],
      references: [ContactsTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [ContactsNotesTable.createdByUserProfileId],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertContactsNotesSchema = createInsertSchema(ContactsNotesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as ContactNoteClientGeneratedId,
    contactId: v.contactId as ContactId,
    createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
  }));

export const selectContactsNotesSchema = createSelectSchema(ContactsNotesTable).transform((v) => ({
  ...v,
  id: v.id as ContactNoteId,
  clientTemporaryId: v.clientTemporaryId as ContactNoteClientGeneratedId,
  contactId: v.contactId as ContactId,
  createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
}));

export const updateContactsNotesSchema = createInsertSchema(ContactsNotesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as ContactNoteId,
    clientTemporaryId: v.clientTemporaryId as ContactNoteClientGeneratedId,
    contactId: v.contactId as ContactId,
    createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
  }));

export type InsertContactsNotesSchema = z.infer<typeof insertContactsNotesSchema>;
export type SelectContactsNotesSchema = z.infer<typeof selectContactsNotesSchema>;

export default ContactsNotesTable;
