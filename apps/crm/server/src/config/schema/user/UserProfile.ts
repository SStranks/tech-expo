import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { char, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { COMPANY_ROLES } from '#Models/domain/user/profile/profile.types.js';

import CompaniesTable from '../companies/Companies.js';
import ContactsNotesTable from '../contacts/ContactsNotes.js';
import CountriesTable from '../Countries.js';
import PipelineDealsTable from '../pipeline/Deals.js';
import QuotesTable from '../quotes/Quotes.js';
import TimeZoneTable from '../TimeZones.js';
import UserTable from './User.js';

// ---------- ENUMS --------- //
export const CompanyRolesEnum = pgEnum('company_role', COMPANY_ROLES);

// ---------- TABLES -------- //
export type UserProfileTableInsert = InferInsertModel<typeof UserProfileTable>;
export type UserProfileTableSelect = InferSelectModel<typeof UserProfileTable>;
export type UserProfileTableUpdate = Partial<Omit<UserProfileTableInsert, 'id'>>;
export const UserProfileTable = pgTable('user_profile', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  userId: uuid('user_id')
    .references(() => UserTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UUID>(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(), // TODO:  Option to sync with account email, or use separate one.
  mobile: varchar('mobile', { length: 255 }),
  telephone: varchar('telephone', { length: 255 }),
  timezone: uuid('timezone_id').references(() => TimeZoneTable.id),
  countryId: uuid('country_id')
    .references(() => CountriesTable.id)
    .notNull()
    .$type<UUID>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull()
    .$type<UUID>(),
  companyRole: CompanyRolesEnum('company_role').notNull(),
  image: char('profile_image', { length: 32 }), // MD5 hash of UUID (used as image name)
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const UserProfileTableRelations = relations(UserProfileTable, ({ many, one }) => {
  return {
    contactsNotes: many(ContactsNotesTable),
    pipelineDeals: many(PipelineDealsTable),
    quote: many(QuotesTable),
    company: one(CompaniesTable, {
      fields: [UserProfileTable.companyId],
      references: [CompaniesTable.id],
    }),
    country: one(CountriesTable, {
      fields: [UserProfileTable.countryId],
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
export const selectUserProfileSchema = createSelectSchema(UserProfileTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export const updateUserProfileSchema = insertUserProfileSchema.omit({ id: true }).partial();
export type InsertUserProfileSchema = z.infer<typeof insertUserProfileSchema>;
export type SelectUserProfileSchema = z.infer<typeof selectUserProfileSchema>;

export default UserProfileTable;
