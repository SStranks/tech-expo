import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import UserProfileTable from '../user/UserProfile.js';
import QuotesTable from './Quotes.js';

// ---------- TABLES -------- //
export type QuotesNotesTableInsert = InferInsertModel<typeof QuotesNotesTable>;
export type QuotesNotesTableSelect = InferSelectModel<typeof QuotesNotesTable>;
export type QuotesNotesTableUpdate = Partial<Omit<QuotesNotesTableInsert, 'id'>>;
export const QuotesNotesTable = pgTable('quotes_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  note: text('note_text').notNull(),
  quoteId: uuid('quote_id')
    .references(() => QuotesTable.id, { onDelete: 'cascade' })
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
      fields: [QuotesNotesTable.quoteId],
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
export const updateQuotesNotesSchema = insertQuotesNotesSchema.omit({ id: true }).partial();
export type InsertQuotesNotesSchema = z.infer<typeof insertQuotesNotesSchema>;
export type SelectQuotesNotesSchema = z.infer<typeof selectQuotesNotesSchema>;

export default QuotesNotesTable;
