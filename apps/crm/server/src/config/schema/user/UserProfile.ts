import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { CountryId } from '#Models/domain/country/country.types.js';
import type { TimeZoneId } from '#Models/domain/timezone/timezone.types.js';
import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';
import type { UserId } from '#Models/domain/user/user.types.js';

import { relations } from 'drizzle-orm';
import { char, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { COMPANY_ROLES } from '#Models/domain/user/profile/profile.types.js';

import CalendarEventsParticipantsTable from '../calendar/EventsParticipants.js';
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
  id: uuid('id').primaryKey().defaultRandom().$type<UserProfileId>(),
  userId: uuid('user_id')
    .references(() => UserTable.id, { onDelete: 'no action' })
    .notNull()
    .$type<UserId>(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(), // TODO:  Option to sync with account email, or use separate one.
  mobile: varchar('mobile', { length: 255 }),
  telephone: varchar('telephone', { length: 255 }),
  timezoneId: uuid('timezone_id')
    .references(() => TimeZoneTable.id)
    .$type<TimeZoneId>(),
  countryId: uuid('country_id')
    .references(() => CountriesTable.id)
    .notNull()
    .$type<CountryId>(),
  companyRole: CompanyRolesEnum('company_role').notNull(),
  image: char('profile_image', { length: 32 }), // MD5 hash of UUID (used as image name)
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const UserProfileTableRelations = relations(UserProfileTable, ({ many, one }) => {
  return {
    calendarEvents: many(CalendarEventsParticipantsTable),
    company: many(CompaniesTable),
    contactsNotes: many(ContactsNotesTable),
    pipelineDeals: many(PipelineDealsTable),
    quote: many(QuotesTable),
    country: one(CountriesTable, {
      fields: [UserProfileTable.countryId],
      references: [CountriesTable.id],
    }),
    timezone: one(TimeZoneTable, {
      fields: [UserProfileTable.timezoneId],
      references: [TimeZoneTable.id],
    }),
    user: one(UserTable, {
      fields: [UserProfileTable.userId],
      references: [UserTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertUserProfileSchema = createInsertSchema(UserProfileTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    countryId: v.countryId as CountryId,
    timezoneId: v.timezoneId as TimeZoneId,
    userId: v.userId as UserId,
  }));

export const selectUserProfileSchema = createSelectSchema(UserProfileTable).transform((v) => ({
  ...v,
  id: v.id as UserProfileId,
  countryId: v.countryId as CountryId,
  timezoneId: v.timezoneId as TimeZoneId,
  userId: v.userId as UserId,
}));

export const updateUserProfileSchema = createInsertSchema(UserProfileTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UserProfileId,
    countryId: v.countryId as CountryId,
    timezoneId: v.timezoneId as TimeZoneId,
    userId: v.userId as UserId,
  }));

export type InsertUserProfileSchema = z.infer<typeof insertUserProfileSchema>;
export type SelectUserProfileSchema = z.infer<typeof selectUserProfileSchema>;

export default UserProfileTable;
