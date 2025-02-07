import type { UUID } from 'node:crypto';

import { InferInsertModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { CompaniesTable } from '../companies/Companies';
import { KanbanStagesTable } from './Stages';
import { TasksTable } from './Tasks';

// ---------- TABLES -------- //
export type TKanbanTable = InferInsertModel<typeof KanbanTable>;
export const KanbanTable = pgTable('kanban', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  companyId: uuid('company_id')
    .references(() => CompaniesTable.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// -------- RELATIONS ------- //
export const KanbanTableRelations = relations(KanbanTable, ({ many, one }) => {
  return {
    stages: many(KanbanStagesTable),
    tasks: many(TasksTable),
    company: one(CompaniesTable, {
      fields: [KanbanTable.companyId],
      references: [CompaniesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanSchema = createInsertSchema(KanbanTable);
export const selectKanbanSchema = createSelectSchema(KanbanTable);
export type TInsertKanbanSchema = z.infer<typeof insertKanbanSchema>;
export type TSelectKanbanSchema = z.infer<typeof selectKanbanSchema>;
