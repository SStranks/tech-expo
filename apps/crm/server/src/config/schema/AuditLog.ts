import type { UUID } from 'node:crypto';

import { relations } from 'drizzle-orm';
import { jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { UserTable } from './index.js';

// ---------- ENUMS --------- //
export type TEntityAction = (typeof ENTITY_ACTION)[number];
export const ENTITY_ACTION = ['INSERT', 'UPDATE', 'DELETE'] as const;
export const EntityActionsEnum = pgEnum('entity_action', ENTITY_ACTION);

// ---------- TABLES -------- //
export const AuditLogTable = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  tableName: varchar('table_name', { length: 255 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  entityAction: EntityActionsEnum('entity_action').notNull(),
  changedAt: timestamp('entity_timestamp', { mode: 'date' }).defaultNow().notNull(),
  changedBy: uuid('user_id')
    .references(() => UserTable.id)
    .notNull()
    .$type<UUID>(),
  originalValues: jsonb('values_original'),
  newValues: jsonb('values_new'),
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
export const insertAuditSchema = createInsertSchema(AuditLogTable);
export const selectAuditSchema = createSelectSchema(AuditLogTable);
export type TInsertAuditSchema = z.infer<typeof insertAuditSchema>;
export type TSelectAuditSchema = z.infer<typeof selectAuditSchema>;

export default AuditLogTable;
