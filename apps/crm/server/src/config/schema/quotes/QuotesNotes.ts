import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { QuotesTable, UserProfileTable } from '../index.js';

// ---------- TABLES -------- //
export type QuotesNotesTableInsert = InferInsertModel<typeof QuotesNotesTable>;
export type QuotesNotesTableSelect = InferSelectModel<typeof QuotesNotesTable>;
export const QuotesNotesTable = pgTable('quotes_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  note: text('note_text').notNull(),
  quote: uuid('quote_id')
    .references(() => QuotesTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by_user_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const QuotesNotesTableRelations = relations(QuotesNotesTable, ({ one }) => {
  return {
    quote: one(QuotesTable, {
      fields: [QuotesNotesTable.quote],
      references: [QuotesTable.id],
    }),
    user: one(UserProfileTable, {
      fields: [QuotesNotesTable.createdBy],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertQuotesNotesSchema = createInsertSchema(QuotesNotesTable);
export const selectQuotesNotesSchema = createSelectSchema(QuotesNotesTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export type InsertQuotesNotesSchema = z.infer<typeof insertQuotesNotesSchema>;
export type SelectQuotesNotesSchema = z.infer<typeof selectQuotesNotesSchema>;

export default QuotesNotesTable;
