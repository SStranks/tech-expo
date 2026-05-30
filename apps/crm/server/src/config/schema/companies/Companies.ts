import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { CompanyClientGeneratedId, CompanyId } from '#Models/domain/company/company.types.js';
import type { CountryId } from '#Models/domain/country/country.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import { relations } from 'drizzle-orm';
import { numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { BUSINESS_TYPE, COMPANY_SIZE } from '#Models/domain/company/company.types.js';

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
  id: uuid('id').primaryKey().defaultRandom().$type<CompanyId>(),
  clientGeneratedId: uuid('client_generated_id').unique().notNull().$type<CompanyClientGeneratedId>(),
  name: varchar('company_name', { length: 255 }).notNull().unique(),
  size: CompanySizeEnum('company_size').notNull(),
  totalRevenue: numeric('total_revenue', { precision: 14, scale: 2 }),
  industry: varchar('industry', { length: 100 }).notNull(),
  businessType: BusinessTypeEnum('business_type').notNull(),
  salesOwner: uuid('sales_owner_user_profile_id')
    .references(() => UserProfileTable.id)
    .notNull()
    .$type<UserProfileId>(),
  countryId: uuid('country_id')
    .references(() => CountriesTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<CountryId>(),
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
    userProfile: one(UserProfileTable, {
      fields: [CompaniesTable.salesOwner],
      references: [UserProfileTable.id],
    }),
    country: one(CountriesTable, {
      fields: [CompaniesTable.countryId],
      references: [CountriesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertCompaniesSchema = createInsertSchema(CompaniesTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    clientGeneratedId: v.clientGeneratedId as CompanyClientGeneratedId,
    countryId: v.countryId as CountryId,
  }));

export const selectCompaniesSchema = createSelectSchema(CompaniesTable).transform((v) => ({
  ...v,
  id: v.id as CompanyId,
  clientGeneratedId: v.clientGeneratedId as CompanyClientGeneratedId,
  countryId: v.countryId as CountryId,
}));

export const updateCompaniesSchema = createSelectSchema(CompaniesTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as CompanyId,
    clientGeneratedId: v.clientGeneratedId as CompanyClientGeneratedId,
    countryId: v.countryId as CountryId,
  }));

export const updateCompaniesCommandSchema = createInsertSchema(CompaniesTable)
  .partial()
  .extend({
    addNotes: z
      .array(
        z.object({
          body: z.string().min(1),
        })
      )
      .optional(),
  })
  .transform((v) => ({
    ...v,
    id: v.id as CompanyId,
    clientGeneratedId: v.clientGeneratedId as CompanyClientGeneratedId,
    countryId: v.countryId as CountryId,
  }));

export type InsertCompaniesSchema = z.infer<typeof insertCompaniesSchema>;
export type SelectCompaniesSchema = z.infer<typeof selectCompaniesSchema>;

export default CompaniesTable;
