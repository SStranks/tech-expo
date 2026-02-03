import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { QUOTE_STAGE } from '#Models/domain/quote/quote.types.js';

import CompaniesTable from '../companies/Companies.js';
import ContactsTable from '../contacts/Contacts.js';
import UserProfileTable from '../user/UserProfile.js';
import QuotesNotesTable from './QuotesNotes.js';
import QuoteServicesTable from './Services.js';

// ---------- ENUMS --------- //
export const QuoteStageEnum = pgEnum('quote_stage', QUOTE_STAGE);

// ---------- TABLES -------- //
export type QuotesTableInsert = InferInsertModel<typeof QuotesTable>;
export type QuotesTableSelect = InferSelectModel<typeof QuotesTable>;
export type QuotesTableUpdate = Partial<Omit<QuotesTableInsert, 'id'>>;
export const QuotesTable = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  title: varchar('title', { length: 255 }).notNull().unique(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'no action' })
    .notNull(),
  totalAmount: numeric('total_amount', { precision: 14, scale: 2 }).default('0.00').notNull(),
  salesTax: numeric('sales_tax', { precision: 4, scale: 2 }).default('20.00').notNull(),
  stage: QuoteStageEnum('quote_stage').notNull(),
  preparedForContactId: uuid('prepared_for_id')
    .references(() => ContactsTable.id)
    .notNull()
    .$type<UUID>(),
  preparedByUserProfileId: uuid('prepared_by_id')
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
      fields: [QuotesTable.companyId],
      references: [CompaniesTable.id],
    }),
    preparedBy: one(UserProfileTable, {
      fields: [QuotesTable.preparedByUserProfileId],
      references: [UserProfileTable.id],
    }),
    preparedFor: one(ContactsTable, {
      fields: [QuotesTable.preparedForContactId],
      references: [ContactsTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertQuotesSchema = createInsertSchema(QuotesTable);
export const selectQuotesSchema = createSelectSchema(QuotesTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export const updateQuotesSchema = insertQuotesSchema.omit({ id: true }).partial();
export type InsertQuotesSchema = z.infer<typeof insertQuotesSchema>;
export type SelectQuotesSchema = z.infer<typeof selectQuotesSchema>;

export default QuotesTable;
