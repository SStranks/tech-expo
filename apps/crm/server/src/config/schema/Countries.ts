import type { UUID } from 'node:crypto';

import { InferInsertModel, relations } from 'drizzle-orm';
import { integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable } from './companies/Companies';
import { UserProfileTable } from './user/UserProfile';

// ---------- TABLES -------- //
export type TCountriesTable = InferInsertModel<typeof CountriesTable>;
export const CountriesTable = pgTable('countries', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  numCode: integer('num_code').unique().notNull(),
  alpha2Code: varchar('alpha_2_code').unique().notNull(),
  alpha3Code: varchar('alpha_3_code').unique().notNull(),
  shortName: varchar('short_name', { length: 100 }).unique().notNull(),
  nationality: varchar('nationality', { length: 100 }),
});

// -------- RELATIONS ------- //
export const CountriesTablerelations = relations(CountriesTable, ({ many }) => {
  return {
    country: many(CompaniesTable),
    user: many(UserProfileTable),
  };
});

// ----------- ZOD ---------- //
export const insertCountriesSchema = createInsertSchema(CountriesTable);
export const selectCountriesSchema = createSelectSchema(CountriesTable);
export type TInsertCountriesSchema = z.infer<typeof insertCountriesSchema>;
export type TSelectCountriesSchema = z.infer<typeof selectCountriesSchema>;

export default CountriesTable;
