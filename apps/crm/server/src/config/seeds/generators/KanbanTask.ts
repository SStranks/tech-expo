import type { KanbanTaskChecklistItemTableInsert } from '#Config/schema/kanban/ChecklistItems.ts';
import type { KanbanTasksTableInsert } from '#Config/schema/kanban/Tasks.ts';
import type { KanbanTaskCommentsTableInsert } from '#Config/schema/kanban/TasksComments.ts';
import type { KanbanStageId } from '#Models/domain/kanban/stage/stage.types.js';
import type {
  KanbanTaskChecklistItemClientGeneratedId,
  KanbanTaskClientGeneratedId,
  KanbanTaskCommentClientGeneratedId,
  KanbanTaskId,
} from '#Models/domain/kanban/task/task.types.js';

import type { SeedKanbanUsers } from '../Kanban.js';

import { createMockUUID } from '@apps/crm-shared/utils';
import { faker } from '@faker-js/faker';

import KanbanTasks from '#Data/KanbanTasks.json';

// TODO:  Possibility of duplicate task from faker.arrayElement calls; amend to ensure unique random value
export function generateKanbanTask(
  orderKey: string,
  users: SeedKanbanUsers,
  stageId: KanbanStageId,
  stageTitle: string
): KanbanTasksTableInsert {
  const { description, title } = faker.helpers.arrayElement(KanbanTasks.tasks);
  const assignedUserProfileId = faker.helpers.arrayElement(users).id;
  const completed = stageTitle === 'done' ? true : false;
  const dueDate = faker.date.soon({ days: 60 });

  return {
    assignedUserProfileId,
    clientGeneratedId: createMockUUID() as KanbanTaskClientGeneratedId,
    completed,
    description,
    dueDate,
    orderKey,
    stageId: stageId,
    title,
  };
}

export function generateKanbanTaskChecklist(taskId: KanbanTaskId, title: string) {
  const checklistItems: KanbanTaskChecklistItemTableInsert[] = [];
  const task = KanbanTasks.tasks.find((task) => task.title === title);
  if (!task) throw new Error(`Incongruency in JSON and SQL return data; task title`);

  task.checklist.forEach(({ completed, title }) => {
    checklistItems.push({
      clientGeneratedId: createMockUUID() as KanbanTaskChecklistItemClientGeneratedId,
      completed,
      taskId,
      title,
    });
  });

  return checklistItems;
}

export function generateKanbanTaskComments(users: SeedKanbanUsers, taskId: KanbanTaskId, title: string) {
  const comments: KanbanTaskCommentsTableInsert[] = [];
  const task = KanbanTasks.tasks.find((task) => task.title === title);
  if (!task) throw new Error(`Incongruency in JSON and SQL return data; task title`);

  task.comments.forEach((comment) => {
    const createdByUserProfileId = faker.helpers.arrayElement(users).id;
    comments.push({
      clientGeneratedId: createMockUUID() as KanbanTaskCommentClientGeneratedId,
      comment,
      createdByUserProfileId,
      taskId,
    });
  });

  return comments;
}
