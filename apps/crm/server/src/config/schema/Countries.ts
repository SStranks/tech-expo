import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import CompaniesTable from './companies/Companies.js';
import TimeZoneTable from './TimeZones.js';
import UserProfileTable from './user/UserProfile.js';

// ---------- TABLES -------- //
export type CountriesTableInsert = InferInsertModel<typeof CountriesTable>;
export type CountriesTableSelect = InferSelectModel<typeof CountriesTable>;
export type CountriesTableUpdate = Partial<Omit<CountriesTableInsert, 'id'>>;
export const CountriesTable = pgTable('countries', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  numCode: integer('num_code').unique().notNull(),
  alpha2Code: varchar('alpha_2_code').unique().notNull(),
  alpha3Code: varchar('alpha_3_code').unique().notNull(),
  shortName: varchar('short_name', { length: 100 }).unique().notNull(),
  nationality: varchar('nationality', { length: 100 }).notNull(),
});

// -------- RELATIONS ------- //
export const CountriesTablerelations = relations(CountriesTable, ({ many }) => {
  return {
    company: many(CompaniesTable),
    timezone: many(TimeZoneTable),
    user: many(UserProfileTable),
  };
});

// ----------- ZOD ---------- //
export const insertCountriesSchema = createInsertSchema(CountriesTable);
export const selectCountriesSchema = createSelectSchema(CountriesTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export const updateCountriesSchema = insertCountriesSchema.omit({ id: true }).partial();
export type InsertCountriesSchema = z.infer<typeof insertCountriesSchema>;
export type SelectCountriesSchema = z.infer<typeof selectCountriesSchema>;

export default CountriesTable;
