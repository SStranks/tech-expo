import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CompanyId } from '#Models/domain/company/company.types.js';
import type { ContactId } from '#Models/domain/contact/contact.types.js';
import type { QuoteClientGeneratedId, QuoteId } from '#Models/domain/quote/quote.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import { relations } from 'drizzle-orm';
import { numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { QUOTE_STAGE } from '#Models/domain/quote/quote.types.js';

import CompaniesTable from '../companies/Companies.js';
import ContactsTable from '../contacts/Contacts.js';
import UserProfileTable from '../user/UserProfile.js';
import QuotesNotesTable from './QuotesNotes.js';
import QuoteServicesTable from './QuotesServices.js';

// ---------- ENUMS --------- //
export const QuoteStageEnum = pgEnum('quote_stage', QUOTE_STAGE);

// ---------- TABLES -------- //
export type QuotesTableInsert = InferInsertModel<typeof QuotesTable>;
export type QuotesTableSelect = InferSelectModel<typeof QuotesTable>;
export type QuotesTableUpdate = Partial<Omit<QuotesTableInsert, 'id'>>;
export const QuotesTable = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom().$type<QuoteId>(),
  clientGeneratedId: uuid('client_generated_id').unique().notNull().$type<QuoteClientGeneratedId>(),
  title: varchar('title', { length: 255 }).notNull().unique(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<CompanyId>(),
  totalAmount: numeric('total_amount', { precision: 14, scale: 2 }).default('0.00').notNull(),
  salesTax: numeric('sales_tax', { precision: 4, scale: 2 }).default('20.00').notNull(),
  stage: QuoteStageEnum('quote_stage').default('DRAFT').notNull(),
  preparedForContactId: uuid('prepared_for_id')
    .references(() => ContactsTable.id)
    .notNull()
    .$type<ContactId>(),
  preparedByUserProfileId: uuid('prepared_by_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UserProfileId>(),
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
export const insertQuotesSchema = createInsertSchema(QuotesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientGeneratedId: v.clientGeneratedId as QuoteClientGeneratedId,
    companyId: v.companyId as CompanyId,
    preparedByUserProfileId: v.preparedByUserProfileId as UserProfileId,
    preparedForContactId: v.preparedForContactId as ContactId,
  }));

export const selectQuotesSchema = createSelectSchema(QuotesTable).transform((v) => ({
  ...v,
  id: v.id as QuoteId,
  clientGeneratedId: v.clientGeneratedId as QuoteClientGeneratedId,
  companyId: v.companyId as CompanyId,
  preparedByUserProfileId: v.preparedByUserProfileId as UserProfileId,
  preparedForContactId: v.preparedForContactId as ContactId,
}));

export const updateQuotesSchema = createSelectSchema(QuotesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as QuoteId,
    clientGeneratedId: v.clientGeneratedId as QuoteClientGeneratedId,
    companyId: v.companyId as CompanyId,
    preparedByUserProfileId: v.preparedByUserProfileId as UserProfileId,
    preparedForContactId: v.preparedForContactId as ContactId,
  }));

export type InsertQuotesSchema = z.infer<typeof insertQuotesSchema>;
export type SelectQuotesSchema = z.infer<typeof selectQuotesSchema>;

export default QuotesTable;
