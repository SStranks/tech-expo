import type { UUID } from 'node:crypto';

import { relations } from 'drizzle-orm';
import { char, jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { UserTable } from './user/User';

// ---------- ENUMS --------- //
export type TEntityAction = (typeof ENTITY_ACTION)[number];
export const ENTITY_ACTION = ['create', 'update', 'delete'] as const;
export const EntityActionsEnum = pgEnum('entity_action', ENTITY_ACTION);

// ---------- TABLES -------- //
export const AuditLogTable = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  tableName: varchar('table_name', { length: 255 }).notNull(),
  entityId: char('entity_id', { length: 32 }),
  entityAction: EntityActionsEnum('entity_action').notNull(),
  changedAt: timestamp('entity_timestamp', { mode: 'date' }).defaultNow().notNull(),
  changedBy: uuid('user_id')
    .references(() => UserTable.id)
    .notNull(),
  originalValues: jsonb('values_original'),
  newValues: jsonb('values_new').notNull(),
});

// -------- RELATIONS ------- //
export const AuditLogTableRelations = relations(AuditLogTable, ({ one }) => {
  return {
    user: one(UserTable, {
      fields: [AuditLogTable.changedBy],
      references: [UserTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
