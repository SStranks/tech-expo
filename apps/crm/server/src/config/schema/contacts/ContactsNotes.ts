import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { ContactsTable, UserProfileTable } from '../index.js';

// ---------- TABLES -------- //
export type TContactsNotesTableInsert = InferInsertModel<typeof ContactsNotesTable>;
export type TContactsNotesTableSelect = InferSelectModel<typeof ContactsNotesTable>;
export const ContactsNotesTable = pgTable('contacts_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  note: text('note_text').notNull(),
  contactId: uuid('contact_id')
    .references(() => ContactsTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by_user_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const ContactsNotesTableeRelations = relations(ContactsNotesTable, ({ one }) => {
  return {
    contact: one(ContactsTable, {
      fields: [ContactsNotesTable.contactId],
      references: [ContactsTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [ContactsNotesTable.createdBy],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertContactsNotesSchema = createInsertSchema(ContactsNotesTable);
export const selectContactsNotesSchema = createSelectSchema(ContactsNotesTable);
export type TInsertContactsNotesSchema = z.infer<typeof insertContactsNotesSchema>;
export type TSelectContactsNotesSchema = z.infer<typeof selectContactsNotesSchema>;

export default ContactsNotesTable;
