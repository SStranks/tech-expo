import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { char, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import {
  CompaniesTable,
  ContactsNotesTable,
  CountriesTable,
  PipelineDealsTable,
  QuotesTable,
  TimeZoneTable,
  UserTable,
} from '../index.js';

// ---------- ENUMS --------- //
export type TCompanyRoles = (typeof COMPANY_ROLES)[number];
export const COMPANY_ROLES = ['ADMIN', 'SALES_MANAGER', 'SALES_PERSON', 'SALES_INTERN'] as const;
export const CompanyRolesEnum = pgEnum('company_role', COMPANY_ROLES);

// ---------- TABLES -------- //
export type TUserProfileTableInsert = InferInsertModel<typeof UserProfileTable>;
export type TUserProfileTableSelect = InferSelectModel<typeof UserProfileTable>;
export const UserProfileTable = pgTable('user_profile', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  userId: uuid('user_id')
    .references(() => UserTable.id)
    .notNull()
    .$type<UUID>(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(), // TODO:  Option to sync with account email, or use separate one.
  mobile: varchar('mobile', { length: 255 }),
  telephone: varchar('telephone', { length: 255 }),
  timezone: uuid('timezone_id').references(() => TimeZoneTable.id),
  country: uuid('country_id')
    .references(() => CountriesTable.id)
    .notNull()
    .$type<UUID>(),
  company: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull()
    .$type<UUID>(),
  companyRole: CompanyRolesEnum('company_role').notNull(),
  image: char('profile_image', { length: 32 }), // MD5 hash of UUID (used as image name)
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const UserProfileTableRelations = relations(UserProfileTable, ({ many, one }) => {
  return {
    contactsNotes: many(ContactsNotesTable),
    pipelineDeals: many(PipelineDealsTable),
    quote: many(QuotesTable),
    company: one(CompaniesTable, {
      fields: [UserProfileTable.company],
      references: [CompaniesTable.id],
    }),
    country: one(CountriesTable, {
      fields: [UserProfileTable.country],
      references: [CountriesTable.id],
    }),
    timezone: one(TimeZoneTable, {
      fields: [UserProfileTable.timezone],
      references: [TimeZoneTable.id],
    }),
    user: one(UserTable, {
      fields: [UserProfileTable.userId],
      references: [UserTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertUserProfileSchema = createInsertSchema(UserProfileTable);
export const selectUserProfileSchema = createSelectSchema(UserProfileTable);
export type TInsertUserProfileSchema = z.infer<typeof insertUserProfileSchema>;
export type TSelectUserProfileSchema = z.infer<typeof selectUserProfileSchema>;

export default UserProfileTable;
