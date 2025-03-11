import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable, ContactsTable, QuoteServicesTable, QuotesNotesTable, UserProfileTable } from '../index.js';

// ---------- ENUMS --------- //
export type TQuoteStage = (typeof QUOTE_STAGE)[number];
export const QUOTE_STAGE = ['draft', 'sent', 'accepted'] as const;
export const QuoteStageEnum = pgEnum('quote_stage', QUOTE_STAGE);

// ---------- TABLES -------- //
export type TQuotesTableInsert = InferInsertModel<typeof QuotesTable>;
export type TQuotesTableSelect = InferSelectModel<typeof QuotesTable>;
export const QuotesTable = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull(),
  company: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull(),
  total: numeric('total', { precision: 14, scale: 2 }).default('0.00').notNull(),
  salesTax: numeric('sales_tax', { precision: 4, scale: 2 }).default('20.00').notNull(),
  stage: QuoteStageEnum('quote_stage').notNull(),
  preparedFor: uuid('prepared_for_contact_id')
    .references(() => ContactsTable.id)
    .notNull()
    .$type<UUID>(),
  preparedBy: uuid('prepared_by_user_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UUID>(),
  issuedAt: timestamp('issued_at', { mode: 'date' }),
  dueAt: timestamp('due_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const QuotesTableRelations = relations(QuotesTable, ({ many, one }) => {
  return {
    quoteNote: one(QuotesNotesTable),
    services: many(QuoteServicesTable),
    company: one(CompaniesTable, {
      fields: [QuotesTable.company],
      references: [CompaniesTable.id],
    }),
    preparedBy: one(UserProfileTable, {
      fields: [QuotesTable.preparedBy],
      references: [UserProfileTable.id],
    }),
    preparedFor: one(ContactsTable, {
      fields: [QuotesTable.preparedFor],
      references: [ContactsTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertQuotesSchema = createInsertSchema(QuotesTable);
export const selectQuotesSchema = createSelectSchema(QuotesTable);
export type TInsertQuotesSchema = z.infer<typeof insertQuotesSchema>;
export type TSelectQuotesSchema = z.infer<typeof selectQuotesSchema>;

export default QuotesTable;
