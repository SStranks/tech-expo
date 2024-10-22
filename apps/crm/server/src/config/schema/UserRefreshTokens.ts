import type { UUID } from 'node:crypto';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { boolean, integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

import { UserTable } from './User';

// User RefreshTokens Table
export const UserRefreshTokensTable = pgTable('userTokens', {
  jti: uuid('jti').primaryKey().notNull().$type<UUID>(),
  iat: integer('iat').notNull(),
  exp: integer('exp').notNull(),
  acc: integer('acc').notNull().default(0),
  activated: boolean('active').notNull().default(false),
  userId: uuid('userId')
    .references(() => UserTable.id)
    .notNull(),
});

// Relations
export const UserRefreshTokensTableRelations = relations(UserRefreshTokensTable, ({ one }) => {
  return {
    user: one(UserTable, {
      fields: [UserRefreshTokensTable.userId],
      references: [UserTable.id],
    }),
  };
});

// Zod
export const insertRefreshTokensSchema = createInsertSchema(UserRefreshTokensTable);
export const selectRefreshTokensSchema = createSelectSchema(UserRefreshTokensTable);
export type TInsertRefreshTokensSchema = z.infer<typeof insertRefreshTokensSchema>;
export type TSelectRefreshTokensSchema = z.infer<typeof selectRefreshTokensSchema>;
