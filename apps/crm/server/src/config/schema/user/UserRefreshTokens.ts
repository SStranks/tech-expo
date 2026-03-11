import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import UserTable from './User.js';

// ---------- TABLES -------- //
export type UserRefreshTokensTableInsert = InferInsertModel<typeof UserRefreshTokensTable>;
export type UserRefreshTokensTableSelect = InferSelectModel<typeof UserRefreshTokensTable>;
export type UserRefreshTokensTableUpdate = Partial<Omit<UserRefreshTokensTableInsert, 'id'>>;
export const UserRefreshTokensTable = pgTable('user_tokens', {
  jti: uuid('jti').primaryKey().notNull().$type<UUID>(),
  iat: integer('iat').notNull(),
  exp: integer('exp').notNull(),
  acc: integer('acc').notNull().default(0),
  activated: boolean('activated').notNull().default(false),
  userId: uuid('user_id')
    .references(() => UserTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
});

// -------- RELATIONS ------- //
export const UserRefreshTokensTableRelations = relations(UserRefreshTokensTable, ({ one }) => {
  return {
    user: one(UserTable, {
      fields: [UserRefreshTokensTable.userId],
      references: [UserTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertUserRefreshTokensSchema = createInsertSchema(UserRefreshTokensTable).transform((v) => ({
  ...v,
  userId: v.userId as UUID,
}));

export const selectUserRefreshTokensSchema = createSelectSchema(UserRefreshTokensTable).transform((v) => ({
  ...v,
  userId: v.userId as UUID,
}));

export const updateUserRefreshTokensSchema = createInsertSchema(UserRefreshTokensTable)
  .partial()
  .transform((v) => ({
    ...v,
    userId: v.userId as UUID,
  }));

export type InsertRefreshTokensSchema = z.infer<typeof insertUserRefreshTokensSchema>;
export type SelectRefreshTokensSchema = z.infer<typeof selectUserRefreshTokensSchema>;

export default UserRefreshTokensTable;
