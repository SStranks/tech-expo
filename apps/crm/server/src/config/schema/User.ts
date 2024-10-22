import type { UUID } from 'node:crypto';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { boolean, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { z } from 'zod';

import { UserProfileTable } from './UserProfile';
import { UserRefreshTokensTable } from './UserRefreshTokens';

// User Roles
export type TUserRoles = (typeof USER_ROLES)[number];
export const USER_ROLES = ['ROOT', 'ADMIN', 'MODERATOR', 'USER'] as const;
export const UserRolesEnum = pgEnum('userRole', USER_ROLES);

// User Crendentials Table
export const UserTable = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    role: UserRolesEnum('userRole').default('USER').notNull(),
    password: varchar('password', { length: 255 }).default('').notNull(),
    passwordChangedAt: timestamp('passwordChangedAt').defaultNow().notNull(),
    passwordResetToken: varchar('passwordResetToken', { length: 64 }), // Drizzle pg-core has no BINARY(32) type yet.
    passwordResetExpires: timestamp('passwordResetExpires'),
    accountCreatedAt: timestamp('accountCreatedAt').defaultNow().notNull(),
    accountUpdatedAt: timestamp('accountUpdatedAt').defaultNow().notNull(),
    accountFrozenAt: timestamp('accountFrozenAt').defaultNow(),
    accountFrozen: boolean('accountFrozen').notNull().default(true), // True; until confirmation email acknowledged.
    accountActive: boolean('accountActive').notNull().default(false),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex('emailIndex').on(table.email),
    };
  }
);

// Relations
export const UserTableRelations = relations(UserTable, ({ one, many }) => {
  return {
    profile: one(UserProfileTable),
    refreshTokens: many(UserRefreshTokensTable),
  };
});

// Zod
export const insertUserSchema = createInsertSchema(UserTable);
export const selectUserSchema = createSelectSchema(UserTable);
export type TInsertUserSchema = z.infer<typeof insertUserSchema>;
export type TSelectUserSchema = z.infer<typeof selectUserSchema>;
