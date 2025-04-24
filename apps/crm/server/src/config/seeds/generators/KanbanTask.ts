import type { UUID } from 'node:crypto';

import type {
  TKanbanTaskChecklistItemTableInsert,
  TKanbanTaskCommentsTableInsert,
  TKanbanTasksTableInsert,
} from '#Config/schema/index.js';

import type { TSeedKanbanUsers } from '../Kanban.js';

import { faker } from '@faker-js/faker';

import KanbanTasks from '#Data/KanbanTasks.json';

// TODO:  Possibility of duplicate task from faker.arrayElement calls; amend to ensure unique random value
export function generateKanbanTask(
  users: TSeedKanbanUsers,
  stageId: UUID,
  stageTitle: string
): TKanbanTasksTableInsert {
  const { description, title } = faker.helpers.arrayElement(KanbanTasks.tasks);
  const assignedUser = faker.helpers.arrayElement(users).id;
  const completed = stageTitle === 'done' ? true : false;
  const dueDate = faker.date.soon({ days: 60 });

  return {
    assignedUser,
    completed,
    description,
    dueDate,
    stage: stageId,
    title,
  };
}

export function generateKanbanTaskChecklist(taskId: UUID, title: string) {
  const checklistItems: TKanbanTaskChecklistItemTableInsert[] = [];
  const task = KanbanTasks.tasks.find((task) => task.title === title);
  if (!task) throw new Error(`Incongruency in JSON and SQL return data; task title`);

  task.checklist.forEach(({ completed, title }) => {
    checklistItems.push({ completed, taskId, title });
  });

  return checklistItems;
}

export function generateKanbanTaskComments(users: TSeedKanbanUsers, taskId: UUID, title: string) {
  const comments: TKanbanTaskCommentsTableInsert[] = [];
  const task = KanbanTasks.tasks.find((task) => task.title === title);
  if (!task) throw new Error(`Incongruency in JSON and SQL return data; task title`);

  task.comments.forEach((comment) => {
    const createdBy = faker.helpers.arrayElement(users).id;
    comments.push({ comment, createdBy, taskId });
  });

  return comments;
}
