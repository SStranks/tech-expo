import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { AuditLogTable, UserProfileTable, UserRefreshTokensTable } from '../index.js';

// ---------- ENUMS --------- //
export type TUserRoles = (typeof USER_ROLES)[number];
export const USER_ROLES = ['ROOT', 'ADMIN', 'MODERATOR', 'USER'] as const;
export const UserRolesEnum = pgEnum('user_role', USER_ROLES);

// ---------- TABLES -------- //
export type TUserTableInsert = InferInsertModel<typeof UserTable>;
export type TUserTableSelect = InferSelectModel<typeof UserTable>;
export const UserTable = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    role: UserRolesEnum('user_role').default('USER').notNull(),
    password: varchar('password', { length: 255 }).default('').notNull(),
    passwordChangedAt: timestamp('password_changed_at', { mode: 'date' }).defaultNow().notNull(),
    passwordResetToken: varchar('password_reset_token', { length: 64 }), // Drizzle pg-core has no BINARY(32) type yet.
    passwordResetExpires: timestamp('password_reset_expires', { mode: 'date' }),
    accountCreatedAt: timestamp('account_created_at', { mode: 'date' }).defaultNow().notNull(),
    accountUpdatedAt: timestamp('account_updated_at', { mode: 'date' }).defaultNow().notNull(),
    accountFrozenAt: timestamp('account_frozen_at', { mode: 'date' }).defaultNow(),
    accountFrozen: boolean('account_frozen').notNull().default(true), // True; until confirmation email acknowledged.
    accountActive: boolean('account_active').notNull().default(false),
  },
  (table) => {
    return [uniqueIndex('email_index').on(table.email)];
  }
);

// -------- RELATIONS ------- //
export const UserTableRelations = relations(UserTable, ({ many, one }) => {
  return {
    audit: many(AuditLogTable),
    profile: one(UserProfileTable),
    refreshTokens: many(UserRefreshTokensTable),
  };
});

// ----------- ZOD ---------- //
export const insertUserSchema = createInsertSchema(UserTable);
export const selectUserSchema = createSelectSchema(UserTable);
export type TInsertUserSchema = z.infer<typeof insertUserSchema>;
export type TSelectUserSchema = z.infer<typeof selectUserSchema>;

export default UserTable;
