import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { doublePrecision, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import {
  CalendarTable,
  CompaniesNotesTable,
  ContactsTable,
  CountriesTable,
  KanbanTable,
  PipelineDealsTable,
  QuotesTable,
  UserProfileTable,
} from '../index.js';

// ---------- ENUMS --------- //
export type TCompanySize = (typeof COMPANY_SIZE)[number];
export const COMPANY_SIZE = ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'] as const;
export const CompanySizeEnum = pgEnum('company_size', COMPANY_SIZE);

export type TBusinessType = (typeof BUSINESS_TYPE)[number];
export const BUSINESS_TYPE = ['B2B', 'B2C'] as const;
export const BusinessTypeEnum = pgEnum('business_type', BUSINESS_TYPE);

// ---------- TABLES -------- //
export type TCompaniesTableInsert = InferInsertModel<typeof CompaniesTable>;
export type TCompaniesTableSelect = InferSelectModel<typeof CompaniesTable>;
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
export const selectCompaniesSchema = createSelectSchema(CompaniesTable);
export type TInsertCompaniesSchema = z.infer<typeof insertCompaniesSchema>;
export type TSelectCompaniesSchema = z.infer<typeof selectCompaniesSchema>;

export default CompaniesTable;
