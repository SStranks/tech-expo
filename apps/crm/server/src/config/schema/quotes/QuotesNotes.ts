import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { QuoteNoteClientGeneratedId, QuoteNoteId } from '#Models/domain/quote/note/note.types.js';
import type { QuoteId } from '#Models/domain/quote/quote.types.js';

import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import QuotesTable from './Quotes.js';

// ---------- TABLES -------- //
export type QuotesNotesTableInsert = InferInsertModel<typeof QuotesNotesTable>;
export type QuotesNotesTableSelect = InferSelectModel<typeof QuotesNotesTable>;
export type QuotesNotesTableUpdate = Partial<Omit<QuotesNotesTableInsert, 'id'>>;
export const QuotesNotesTable = pgTable('quotes_notes', {
  id: uuid('id').primaryKey().defaultRandom().$type<QuoteNoteId>(),
  clientGeneratedId: uuid('client_generated_id').unique().notNull().$type<QuoteNoteClientGeneratedId>(),
  content: text('note_content').notNull(),
  quoteId: uuid('quote_id')
    .references(() => QuotesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<QuoteId>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const QuotesNotesTableRelations = relations(QuotesNotesTable, ({ one }) => {
  return {
    quote: one(QuotesTable, {
      fields: [QuotesNotesTable.quoteId],
      references: [QuotesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertQuotesNotesSchema = createInsertSchema(QuotesNotesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientGeneratedId: v.clientGeneratedId as QuoteNoteClientGeneratedId,
    quoteId: v.quoteId as QuoteId,
  }));

export const selectQuotesNotesSchema = createSelectSchema(QuotesNotesTable).transform((v) => ({
  ...v,
  id: v.id as QuoteNoteId,
  clientGeneratedId: v.clientGeneratedId as QuoteNoteClientGeneratedId,
  quoteId: v.quoteId as QuoteId,
}));

export const updateQuotesNotesSchema = createInsertSchema(QuotesNotesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as QuoteNoteId,
    clientGeneratedId: v.clientGeneratedId as QuoteNoteClientGeneratedId,
    quoteId: v.quoteId as QuoteId,
  }));

export type InsertQuotesNotesSchema = z.infer<typeof insertQuotesNotesSchema>;
export type SelectQuotesNotesSchema = z.infer<typeof selectQuotesNotesSchema>;

export default QuotesNotesTable;
