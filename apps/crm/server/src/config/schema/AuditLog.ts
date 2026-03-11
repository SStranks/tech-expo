import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import { relations } from 'drizzle-orm';
import { jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { ENTITY_ACTION } from '#Models/domain/audit/auditlog.types.js';

import UserTable from './user/User.js';

// ---------- ENUMS --------- //
export const EntityActionsEnum = pgEnum('entity_action', ENTITY_ACTION);

// ---------- TABLES -------- //
export type AuditLogTableInsert = InferInsertModel<typeof AuditLogTable>;
export type AuditLogTableSelect = InferSelectModel<typeof AuditLogTable>;
export type AuditLogTableUpdate = Partial<Omit<AuditLogTableInsert, 'id'>>;
export const AuditLogTable = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  tableName: varchar('table_name', { length: 255 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  entityAction: EntityActionsEnum('entity_action').notNull(),
  changedAt: timestamp('entity_timestamp', { mode: 'date' }).defaultNow().notNull(),
  changedByUserId: uuid('user_id')
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
      fields: [AuditLogTable.changedByUserId],
      references: [UserTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertAuditLogSchema = createInsertSchema(AuditLogTable)
  .omit({ id: true })
  .transform((v) => ({ ...v, changedByUserId: v.changedByUserId as UUID }));

export const selectAuditLogSchema = createSelectSchema(AuditLogTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  changedByUserId: v.changedByUserId as UUID,
}));

export const updateAuditLogSchema = createInsertSchema(AuditLogTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    changedByUserId: v.changedByUserId as UUID,
  }));

export type InsertAuditSchema = z.infer<typeof insertAuditLogSchema>;
export type SelectAuditSchema = z.infer<typeof selectAuditLogSchema>;

export default AuditLogTable;
