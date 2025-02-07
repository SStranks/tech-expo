import type { UUID } from 'node:crypto';

import { InferInsertModel, relations } from 'drizzle-orm';
import { char, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { ContactsNotesTable } from '../contacts/ContactsNotes';
import { CountriesTable } from '../Countries';
import { QuotesTable } from '../quotes/Quotes';
import { TimeZoneTable } from '../TimeZones';
import { UserTable } from './User';

// ---------- TABLES -------- //
export type TUserProfileTable = InferInsertModel<typeof UserProfileTable>;
export const UserProfileTable = pgTable('user_profile', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  userId: uuid('user_id')
    .references(() => UserTable.id)
    .notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(), // TODO:  Option to sync with account email, or use separate one.
  mobile: varchar('mobile', { length: 255 }),
  telephone: varchar('telephone', { length: 255 }),
  timezone: uuid('timezone_id').references(() => TimeZoneTable.id),
  country: uuid('country_id')
    .references(() => CountriesTable.id)
    .notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  companyRole: varchar('company_role', { length: 255 }),
  image: char('profile_image', { length: 32 }), // MD5 hash of UUID (used as image name)
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const UserProfileTableRelations = relations(UserProfileTable, ({ many, one }) => {
  return {
    contactsNotes: many(ContactsNotesTable),
    quote: many(QuotesTable),
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
