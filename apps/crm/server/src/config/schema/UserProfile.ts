/* eslint-disable perfectionist/sort-objects */
import type { UUID } from 'node:crypto';

import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { UserTable } from './User';

// User Profile Table
export const UserProfileTable = pgTable('userProfile', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  userId: uuid('userId')
    .references(() => UserTable.id)
    .notNull(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(), // TODO:  Option to sync with account email, or use separate one.
  mobile: varchar('mobile', { length: 255 }),
  telephone: varchar('telephone', { length: 255 }),
  // timezone: , // TODO:  New Table
  // country: , // TODO:  New Table
  company: varchar('company', { length: 255 }).notNull(),
  companyRole: varchar('companyRole', { length: 255 }),

  // image
});

// Relations
export const UserProfileTableRelations = relations(UserProfileTable, ({ one }) => {
  return {
    user: one(UserTable, {
      fields: [UserProfileTable.userId],
      references: [UserTable.id],
    }),
  };
});

// Zod
export const insertUserProfileSchema = createInsertSchema(UserProfileTable);
export const selectUserProfileSchema = createSelectSchema(UserProfileTable);
export type TInsertRefreshTokensSchema = z.infer<typeof insertUserProfileSchema>;
export type TSelectRefreshTokensSchema = z.infer<typeof selectUserProfileSchema>;
