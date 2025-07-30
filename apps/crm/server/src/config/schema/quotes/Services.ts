import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { QuotesTable } from '../index.js';

// ---------- TABLES -------- //
export type TQuoteServicesTableInsert = InferInsertModel<typeof QuoteServicesTable>;
export type TQuoteServicesTableSelect = InferSelectModel<typeof QuoteServicesTable>;
export const QuoteServicesTable = pgTable('quotes_services', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  price: numeric('price', { precision: 14, scale: 2 }).default('0.00').notNull(),
  quantity: integer('quantity').default(0).notNull(),
  discount: numeric('discount', { precision: 4, scale: 2 }).default('0.00').notNull(),
  total: numeric('total', { precision: 14, scale: 2 }).default('0.00').notNull(),
  quoteId: uuid('quote_id')
    .references(() => QuotesTable.id)
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
export const selectQuoteServicesSchema = createSelectSchema(QuoteServicesTable);
export type TInsertQuoteServicesSchema = z.infer<typeof insertQuoteServicesSchema>;
export type TSelectQuoteServicesSchema = z.infer<typeof selectQuoteServicesSchema>;

export default QuoteServicesTable;
