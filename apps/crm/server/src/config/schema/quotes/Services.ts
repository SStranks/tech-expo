import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import QuotesTable from './Quotes.js';

// ---------- TABLES -------- //
export type QuoteServicesTableInsert = InferInsertModel<typeof QuoteServicesTable>;
export type QuoteServicesTableSelect = InferSelectModel<typeof QuoteServicesTable>;
export type QuoteServicesTableUpdate = Partial<Omit<QuoteServicesTableInsert, 'id'>>;
export const QuoteServicesTable = pgTable('quotes_services', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  price: numeric('price', { precision: 14, scale: 2 }).default('0.00').notNull(),
  quantity: integer('quantity').default(0).notNull(),
  discount: numeric('discount', { precision: 4, scale: 2 }).default('0.00').notNull(),
  total: numeric('total', { precision: 14, scale: 2 }).default('0.00').notNull(),
  quoteId: uuid('quote_id')
    .references(() => QuotesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const QuoteServicesTableRelations = relations(QuoteServicesTable, ({ one }) => {
  return {
    quote: one(QuotesTable, {
      fields: [QuoteServicesTable.quoteId],
      references: [QuotesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertQuoteServicesSchema = createInsertSchema(QuoteServicesTable);
export const selectQuoteServicesSchema = createSelectSchema(QuoteServicesTable).extend({
  id: z.uuid() as z.ZodType<UUID>,
});
export const updateQuoteServicesSchema = insertQuoteServicesSchema.omit({ id: true }).partial();
export type InsertQuoteServicesSchema = z.infer<typeof insertQuoteServicesSchema>;
export type SelectQuoteServicesSchema = z.infer<typeof selectQuoteServicesSchema>;

export default QuoteServicesTable;
