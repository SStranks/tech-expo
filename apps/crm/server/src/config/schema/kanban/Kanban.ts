import type { UUID } from '@apps/crm-shared/src/types/api/base.js';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable, KanbanStagesTable, KanbanTasksOrderTable, KanbanTasksTable } from '../index.js';

// ---------- TABLES -------- //
export type KanbanTableInsert = InferInsertModel<typeof KanbanTable>;
export type KanbanTableSelect = InferSelectModel<typeof KanbanTable>;
export const KanbanTable = pgTable('kanban', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull()
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const KanbanTableRelations = relations(KanbanTable, ({ many, one }) => {
  return {
    stages: many(KanbanStagesTable),
    taskOrder: many(KanbanTasksOrderTable),
    tasks: many(KanbanTasksTable),
    company: one(CompaniesTable, {
      fields: [KanbanTable.companyId],
      references: [CompaniesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanSchema = createInsertSchema(KanbanTable);
export const selectKanbanSchema = createSelectSchema(KanbanTable).extend({ id: z.uuid() as z.ZodType<UUID> });
export type InsertKanbanSchema = z.infer<typeof insertKanbanSchema>;
export type SelectKanbanSchema = z.infer<typeof selectKanbanSchema>;

export default KanbanTable;
