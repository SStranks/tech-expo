import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

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
export const insertAuditLogSchema = createInsertSchema(AuditLogTable);
export const selectAuditLogSchema = createSelectSchema(AuditLogTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export const updateAuditLogSchema = insertAuditLogSchema.omit({ id: true }).partial();
export type InsertAuditSchema = z.infer<typeof insertAuditLogSchema>;
export type SelectAuditSchema = z.infer<typeof selectAuditLogSchema>;

export default AuditLogTable;
