import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable, UserProfileTable } from '../index.js';

// ---------- TABLES -------- //
export type CompaniesNotesTableInsert = InferInsertModel<typeof CompaniesNotesTable>;
export type CompaniesNotesTableSelect = InferSelectModel<typeof CompaniesNotesTable>;
export const CompaniesNotesTable = pgTable('companies_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  note: text('note_text').notNull(),
  company: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by_user_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const CompaniesNotesTableRelations = relations(CompaniesNotesTable, ({ one }) => {
  return {
    company: one(CompaniesTable, {
      fields: [CompaniesNotesTable.company],
      references: [CompaniesTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [CompaniesNotesTable.createdBy],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCompaniesNotesSchema = createInsertSchema(CompaniesNotesTable);
export const selectCompaniesNotesSchema = createSelectSchema(CompaniesNotesTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export type InsertCompaniesNotesSchema = z.infer<typeof insertCompaniesNotesSchema>;
export type SelectCompaniesNotesSchema = z.infer<typeof selectCompaniesNotesSchema>;

export default CompaniesNotesTable;
