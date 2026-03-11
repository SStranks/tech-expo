import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { QuoteNoteClientId } from '#Models/domain/quote/note/note.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import UserProfileTable from '../user/UserProfile.js';
import QuotesTable from './Quotes.js';

// ---------- TABLES -------- //
export type QuotesNotesTableInsert = InferInsertModel<typeof QuotesNotesTable>;
export type QuotesNotesTableSelect = InferSelectModel<typeof QuotesNotesTable>;
export type QuotesNotesTableUpdate = Partial<Omit<QuotesNotesTableInsert, 'id'>>;
export const QuotesNotesTable = pgTable('quotes_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  note: text('note_text').notNull(),
  quoteId: uuid('quote_id')
    .references(() => QuotesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdByUserProfileId: uuid('created_by_id')
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
      fields: [QuotesNotesTable.createdByUserProfileId],
      references: [UserProfileTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertQuotesNotesSchema = createInsertSchema(QuotesNotesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as QuoteNoteClientId,
    createdByUserProfileId: v.createdByUserProfileId as UUID,
    quoteId: v.quoteId as UUID,
  }));

export const selectQuotesNotesSchema = createSelectSchema(QuotesNotesTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as QuoteNoteClientId,
  createdByUserProfileId: v.createdByUserProfileId as UUID,
  quoteId: v.quoteId as UUID,
}));

export const updateQuotesNotesSchema = createInsertSchema(QuotesNotesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as QuoteNoteClientId,
    createdByUserProfileId: v.createdByUserProfileId as UUID,
    quoteId: v.quoteId as UUID,
  }));

export type InsertQuotesNotesSchema = z.infer<typeof insertQuotesNotesSchema>;
export type SelectQuotesNotesSchema = z.infer<typeof selectQuotesNotesSchema>;

export default QuotesNotesTable;
