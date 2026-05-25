import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { QuoteNoteClientGeneratedId, QuoteNoteId } from '#Models/domain/quote/note/note.types.js';
import type { QuoteId } from '#Models/domain/quote/quote.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

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
  id: uuid('id').primaryKey().defaultRandom().$type<QuoteNoteId>(),
  clientGeneratedId: uuid('client_generated_id').unique().notNull().$type<QuoteNoteClientGeneratedId>(),
  note: text('note_text').notNull(),
  quoteId: uuid('quote_id')
    .references(() => QuotesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<QuoteId>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdByUserProfileId: uuid('created_by_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UserProfileId>(),
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
    clientGeneratedId: v.clientGeneratedId as QuoteNoteClientGeneratedId,
    createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
    quoteId: v.quoteId as QuoteId,
  }));

export const selectQuotesNotesSchema = createSelectSchema(QuotesNotesTable).transform((v) => ({
  ...v,
  id: v.id as QuoteNoteId,
  clientGeneratedId: v.clientGeneratedId as QuoteNoteClientGeneratedId,
  createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
  quoteId: v.quoteId as QuoteId,
}));

export const updateQuotesNotesSchema = createInsertSchema(QuotesNotesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as QuoteNoteId,
    clientGeneratedId: v.clientGeneratedId as QuoteNoteClientGeneratedId,
    createdByUserProfileId: v.createdByUserProfileId as UserProfileId,
    quoteId: v.quoteId as QuoteId,
  }));

export type InsertQuotesNotesSchema = z.infer<typeof insertQuotesNotesSchema>;
export type SelectQuotesNotesSchema = z.infer<typeof selectQuotesNotesSchema>;

export default QuotesNotesTable;
