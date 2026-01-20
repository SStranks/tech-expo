import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import UserProfileTable from '../user/UserProfile.js';
import ContactsTable from './Contacts.js';

// ---------- TABLES -------- //
export type ContactsNotesTableInsert = InferInsertModel<typeof ContactsNotesTable>;
export type ContactsNotesTableSelect = InferSelectModel<typeof ContactsNotesTable>;
export type ContactsNotesTableUpdate = Partial<Omit<ContactsNotesTableInsert, 'id'>>;
export const ContactsNotesTable = pgTable('contacts_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  note: text('note_text').notNull(),
  contact: uuid('contact_id')
    .references(() => ContactsTable.id, { onDelete: 'cascade' })
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
      fields: [ContactsNotesTable.contact],
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
export const selectContactsNotesSchema = createSelectSchema(ContactsNotesTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updateContactsNotesSchema = insertContactsNotesSchema.omit({ id: true }).partial();
export type InsertContactsNotesSchema = z.infer<typeof insertContactsNotesSchema>;
export type SelectContactsNotesSchema = z.infer<typeof selectContactsNotesSchema>;

export default ContactsNotesTable;
