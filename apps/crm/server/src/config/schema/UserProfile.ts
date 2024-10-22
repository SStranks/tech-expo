import type { UUID } from 'node:crypto';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { z } from 'zod';

import { UserTable } from './User';

// User Profile Table
export const UserProfileTable = pgTable('userProfile', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  userId: uuid('userId')
    .references(() => UserTable.id)
    .notNull(),
  fullName: varchar('fullName', { length: 255 }).notNull(),
  // image
  // phoneOffice,
  // phoneMobile,
  // email,
  // timeZone,
  // organisationRole,
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
