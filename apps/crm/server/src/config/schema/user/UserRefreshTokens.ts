import type { UUID } from 'node:crypto';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { boolean, integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { UserTable } from '../index.js';

// ---------- TABLES -------- //
export type TUserRefreshTokensTableInsert = InferInsertModel<typeof UserRefreshTokensTable>;
export type TUserRefreshTokensTableSelect = InferSelectModel<typeof UserRefreshTokensTable>;
export const UserRefreshTokensTable = pgTable('user_tokens', {
  jti: uuid('jti').primaryKey().notNull().$type<UUID>(),
  iat: integer('iat').notNull(),
  exp: integer('exp').notNull(),
  acc: integer('acc').notNull().default(0),
  activated: boolean('activated').notNull().default(false),
  userId: uuid('user_id')
    .references(() => UserTable.id)
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
export const insertRefreshTokensSchema = createInsertSchema(UserRefreshTokensTable);
export const selectRefreshTokensSchema = createSelectSchema(UserRefreshTokensTable);
export type TInsertRefreshTokensSchema = z.infer<typeof insertRefreshTokensSchema>;
export type TSelectRefreshTokensSchema = z.infer<typeof selectRefreshTokensSchema>;

export default UserRefreshTokensTable;
