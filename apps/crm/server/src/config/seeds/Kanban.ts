import type { PostgresClient } from '#Config/dbPostgres.ts';
import type { KanbanTableInsert } from '#Config/schema/kanban/Kanban.ts';
import type { KanbanStagesTableInsert } from '#Config/schema/kanban/Stages.ts';
import type { KanbanTasksTableInsert } from '#Config/schema/kanban/Tasks.ts';

import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import CompaniesTable from '#Config/schema/companies/Companies.js';
import KanbanTaskChecklistItemTable, {
  KanbanTaskChecklistItemTableInsert,
} from '#Config/schema/kanban/ChecklistItems.js';
import { KanbanTable } from '#Config/schema/kanban/Kanban.js';
import KanbanStagesTable from '#Config/schema/kanban/Stages.js';
import KanbanTasksTable from '#Config/schema/kanban/Tasks.js';
import KanbanTaskCommentsTable, { KanbanTaskCommentsTableInsert } from '#Config/schema/kanban/TasksComments.js';
import KanbanTasksOrderTable, { KanbanTasksOrderTableInsert } from '#Config/schema/kanban/TasksOrder.js';
import { seedSettings } from '#Config/seedSettings.js';

import {
  generateKanbanTask,
  generateKanbanTaskChecklist,
  generateKanbanTaskComments,
} from './generators/KanbanTask.js';

export type SeedKanbanUsers = Awaited<ReturnType<typeof getAllUsers>>;

const { COMPANY_NAME, KANBAN_STAGE_TASKS_MAX, KANBAN_STAGE_TASKS_MIN } = seedSettings;

const KANBAN_TASKS_STAGES = ['unassigned', 'todo', 'in progress', 'in review', 'done'] as const;

const getPrimaryCompany = async (db: PostgresClient) => {
  return await db.query.CompaniesTable.findFirst({
    columns: { id: true },
    where: eq(CompaniesTable.name, COMPANY_NAME),
  });
};

const getAllUsers = async (db: PostgresClient) => {
  return await db.query.UserProfileTable.findMany({});
};

export default async function seedKanban(db: PostgresClient) {
  const primaryCompany = await getPrimaryCompany(db);
  if (!primaryCompany) throw new Error(`Could not source ${COMPANY_NAME} from company table`);

  // ---------------- KANBAN TABLE --------------- //
  const kanbanInsertionData: KanbanTableInsert[] = [];
  // eslint-disable-next-line unicorn/no-immediate-mutation
  kanbanInsertionData.push({ companyId: primaryCompany.id });

  const kanbanTableReturnData = await db
    .insert(KanbanTable)
    .values(kanbanInsertionData)
    .returning({ kanbanId: KanbanTable.id });

  const PRIMARY_COMPANY_KANBAN_ID = kanbanTableReturnData[0].kanbanId;

  // ------------ KANBAN-STAGES TABLE ------------ //
  const stagesInsertionData: KanbanStagesTableInsert[] = [];

  KANBAN_TASKS_STAGES.forEach((title) => {
    stagesInsertionData.push({ kanbanTableId: PRIMARY_COMPANY_KANBAN_ID, title });
  });

  const stagesReturnData = await db
    .insert(KanbanStagesTable)
    .values(stagesInsertionData)
    .returning({ id: KanbanStagesTable.id, title: KanbanStagesTable.title });

  // ------------ KANBAN-TASKS TABLE ------------- //
  const tasksInsertionData: KanbanTasksTableInsert[] = [];
  const allUsers = await getAllUsers(db);

  stagesReturnData.forEach(({ id: stageId, title }) => {
    const randNumOfTasks = faker.number.int({ max: KANBAN_STAGE_TASKS_MAX, min: KANBAN_STAGE_TASKS_MIN });

    for (let i = 0; i < randNumOfTasks; i++) {
      tasksInsertionData.push(generateKanbanTask(allUsers, stageId, title));
    }
  });

  const tasksReturnData = await db.insert(KanbanTasksTable).values(tasksInsertionData).returning();

  // ------- KANBAN-TASKS-CHECKLIST TABLE -------- //
  const taskChecklistInsertionData: KanbanTaskChecklistItemTableInsert[] = [];

  tasksReturnData.forEach(({ id, title }) => {
    taskChecklistInsertionData.push(...generateKanbanTaskChecklist(id, title));
  });

  await db.insert(KanbanTaskChecklistItemTable).values(taskChecklistInsertionData);

  // ------- KANBAN-TASKS-COMMENTS TABLE --------- //
  const taskCommentsInsertionData: KanbanTaskCommentsTableInsert[] = [];

  tasksReturnData.forEach(({ id, title }) => {
    taskCommentsInsertionData.push(...generateKanbanTaskComments(allUsers, id, title));
  });

  await db.insert(KanbanTaskCommentsTable).values(taskCommentsInsertionData).returning();

  // --------- KANBAN-TASKS-ORDER TABLE ---------- //
  const kanbanTasksOrderInsertionData: KanbanTasksOrderTableInsert[] = [];

  stagesReturnData.forEach(({ id: columnId }) => {
    const taskOrder = tasksReturnData.filter((task) => task.stage === columnId).map((task) => task.serial);
    kanbanTasksOrderInsertionData.push({ columnId, kanbanId: PRIMARY_COMPANY_KANBAN_ID, taskOrder });
  });

  await db.insert(KanbanTasksOrderTable).values(kanbanTasksOrderInsertionData);

  // --------- END OF SEEDING -------- //
  console.log('Seed Successful: Kanban.ts');
}
