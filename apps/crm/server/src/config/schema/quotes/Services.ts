import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { QuoteServiceClientId } from '#Models/domain/quote/service/service.types.js';

import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import QuotesTable from './Quotes.js';

// ---------- TABLES -------- //
export type QuoteServicesTableInsert = InferInsertModel<typeof QuoteServicesTable>;
export type QuoteServicesTableSelect = InferSelectModel<typeof QuoteServicesTable>;
export type QuoteServicesTableUpdate = Partial<Omit<QuoteServicesTableInsert, 'id'>>;
export const QuoteServicesTable = pgTable('quotes_services', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  price: numeric('price', { precision: 14, scale: 2 }).default('0.00').notNull(),
  quantity: integer('quantity').default(0).notNull(),
  discount: numeric('discount', { precision: 4, scale: 2 }).default('0.00').notNull(),
  totalAmount: numeric('total_amount', { precision: 14, scale: 2 }).default('0.00').notNull(),
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
export const insertQuoteServicesSchema = createInsertSchema(QuoteServicesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientTemporaryId: v.clientTemporaryId as QuoteServiceClientId,
    quoteId: v.quoteId as UUID,
  }));

export const selectQuoteServicesSchema = createSelectSchema(QuoteServicesTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  clientTemporaryId: v.clientTemporaryId as QuoteServiceClientId,
  quoteId: v.quoteId as UUID,
}));

export const updateQuoteServicesSchema = createInsertSchema(QuoteServicesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    clientTemporaryId: v.clientTemporaryId as QuoteServiceClientId,
    quoteId: v.quoteId as UUID,
  }));

export type InsertQuoteServicesSchema = z.infer<typeof insertQuoteServicesSchema>;
export type SelectQuoteServicesSchema = z.infer<typeof selectQuoteServicesSchema>;

export default QuoteServicesTable;
