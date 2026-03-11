import type { UUID } from '@apps/crm-shared';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';

import type { KanbanTaskClientId } from '#Models/domain/kanban/task/task.types.js';

import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import UserProfileTable from '../user/UserProfile.js';
import KanbanTaskChecklistItemTable from './ChecklistItems.js';
import KanbanStagesTable from './Stages.js';
import KanbanTaskCommentsTable from './TasksComments.js';

// ---------- TABLES -------- //
export type KanbanTasksTableInsert = InferInsertModel<typeof KanbanTasksTable>;
export type KanbanTasksTableSelect = InferSelectModel<typeof KanbanTasksTable>;
export type KanbanTasksTableUpdate = Partial<Omit<KanbanTasksTableInsert, 'id'>>;
export const KanbanTasksTable = pgTable('kanban_tasks', {
  id: uuid('id').primaryKey().defaultRandom().$type<UUID>(),
  clientTemporaryId: uuid('client_temp_id').unique().$type<KanbanTaskClientId>(),
  orderKey: varchar({ length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  completed: boolean('completed').default(false),
  stageId: uuid('stage_id')
    .references(() => KanbanStagesTable.id, { onDelete: 'cascade' })
    .notNull()
    .$type<UUID>(),
  description: text('description_text'),
  dueDate: timestamp('due_date', { mode: 'date' }),
  assignedUserProfileId: uuid('assignee_id')
    .references(() => UserProfileTable.id)
    .$type<UUID>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ---------- RELATIONS -------- //
export const KanbanTaskTableRelations = relations(KanbanTasksTable, ({ many, one }) => {
  return {
    checklistItems: many(KanbanTaskChecklistItemTable),
    comments: many(KanbanTaskCommentsTable),
    assignedUser: one(UserProfileTable, {
      fields: [KanbanTasksTable.assignedUserProfileId],
      references: [UserProfileTable.id],
    }),
    taskStage: one(KanbanStagesTable, {
      fields: [KanbanTasksTable.stageId],
      references: [KanbanStagesTable.id],
    }),
  };
});

// ----------- ZOD ---------- //
export const insertKanbanTasksSchema = createInsertSchema(KanbanTasksTable)
  .omit({ id: true })
  .transform((v) => ({
    ...v,
    assignedUserProfileId: v.assignedUserProfileId as UUID,
    clientTemporaryId: v.clientTemporaryId as KanbanTaskClientId,
    stageId: v.stageId as UUID,
  }));

export const selectKanbanTasksSchema = createSelectSchema(KanbanTasksTable).transform((v) => ({
  ...v,
  id: v.id as UUID,
  assignedUserProfileId: v.assignedUserProfileId as UUID,
  clientTemporaryId: v.clientTemporaryId as KanbanTaskClientId,
  stageId: v.stageId as UUID,
}));

export const updateKanbanTasksSchema = createInsertSchema(KanbanTasksTable)
  .partial()
  .required({ id: true })
  .transform((v) => ({
    ...v,
    id: v.id as UUID,
    assignedUserProfileId: v.assignedUserProfileId as UUID,
    clientTemporaryId: v.clientTemporaryId as KanbanTaskClientId,
    stageId: v.stageId as UUID,
  }));

export type InsertKanbanTasksSchema = z.infer<typeof insertKanbanTasksSchema>;
export type SelectKanbanTasksSchema = z.infer<typeof selectKanbanTasksSchema>;

export default KanbanTasksTable;
