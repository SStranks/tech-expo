import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { doublePrecision, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { BUSINESS_TYPE, COMPANY_SIZE } from '#Models/company/Company.js';

import CalendarTable from '../calendar/Calendar.js';
import ContactsTable from '../contacts/Contacts.js';
import CountriesTable from '../Countries.js';
import KanbanTable from '../kanban/Kanban.js';
import PipelineDealsTable from '../pipeline/Deals.js';
import QuotesTable from '../quotes/Quotes.js';
import UserProfileTable from '../user/UserProfile.js';
import CompaniesNotesTable from './CompanyNotes.js';

// ---------- ENUMS --------- //
export const CompanySizeEnum = pgEnum('company_size', COMPANY_SIZE);
export const BusinessTypeEnum = pgEnum('business_type', BUSINESS_TYPE);

// ---------- TABLES -------- //
export type CompaniesTableInsert = InferInsertModel<typeof CompaniesTable>;
export type CompaniesTableSelect = InferSelectModel<typeof CompaniesTable>;
export type CompaniesTableUpdate = Partial<Omit<CompaniesTableInsert, 'id'>>;
export const CompaniesTable = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  name: varchar('company_name', { length: 255 }).notNull().unique(),
  size: CompanySizeEnum('company_size').notNull(),
  totalRevenue: doublePrecision('total_revenue').notNull(),
  industry: varchar('industry', { length: 100 }).notNull(),
  businessType: BusinessTypeEnum('business_type').notNull(),
  country: uuid('country_id')
    .references(() => CountriesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  website: varchar('website', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const CompaniesTableRelations = relations(CompaniesTable, ({ many, one }) => {
  return {
    calendar: one(CalendarTable),
    contacts: many(ContactsTable),
    deals: many(PipelineDealsTable),
    kanban: one(KanbanTable),
    notes: many(CompaniesNotesTable),
    quotes: many(QuotesTable),
    users: many(UserProfileTable),
    country: one(CountriesTable, {
      fields: [CompaniesTable.country],
      references: [CountriesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCompaniesSchema = createInsertSchema(CompaniesTable);
export const selectCompaniesSchema = createSelectSchema(CompaniesTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export const updateCompaniesSchema = insertCompaniesSchema.omit({ id: true }).partial();
export type InsertCompaniesSchema = z.infer<typeof insertCompaniesSchema>;
export type SelectCompaniesSchema = z.infer<typeof selectCompaniesSchema>;

export default CompaniesTable;
