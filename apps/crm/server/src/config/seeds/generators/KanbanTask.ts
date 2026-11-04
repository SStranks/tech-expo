import type { KanbanTaskChecklistItemTableInsert } from '#Config/schema/kanban/ChecklistItems.ts';
import type { KanbanTasksTableInsert } from '#Config/schema/kanban/Tasks.js';
import type { KanbanTaskCommentsTableInsert } from '#Config/schema/kanban/TasksComments.ts';
import type { KanbanStageId } from '#Models/domain/kanban/stage/stage.types.js';
import type {
  KanbanTaskChecklistItemClientGeneratedId,
  KanbanTaskClientGeneratedId,
  KanbanTaskCommentClientGeneratedId,
  KanbanTaskId,
} from '#Models/domain/kanban/task/task.types.js';

import type { SeedKanbanUsers } from '../Kanban.js';

import { createMockUUID, generateOrderKeyBetween } from '@apps/crm-shared/utils';
import { faker } from '@faker-js/faker';

import KanbanTasksJSON from '#Data/KanbanTasks.json';

export type KanbanTaskTemplate = (typeof KanbanTasksJSON.tasks)[number];

const kanbanTasksShuffled = KanbanTasksJSON.tasks.toSorted(() => Math.random() - 0.5);

export class KanbanTaskGenerator {
  private orderKey: string | null = null;

  private readonly kanbanTasks: KanbanTaskTemplate[];
  private readonly stageId: KanbanStageId;
  private readonly stageTitle: string;
  private readonly users: SeedKanbanUsers;

  constructor(stageId: KanbanStageId, stageTitle: string, allUsers: SeedKanbanUsers) {
    this.kanbanTasks = kanbanTasksShuffled;
    this.stageId = stageId;
    this.stageTitle = stageTitle;
    this.users = allUsers;
  }

  createTask(): { task: KanbanTasksTableInsert; template: KanbanTaskTemplate } {
    const taskTemplate = this.kanbanTasks.pop();
    if (taskTemplate === undefined) throw new Error(`Seed data of 'KanbanTasks.tasks' has been completely consumed`);

    return {
      task: {
        assignedUserProfileId: this.generateAssignedUserId(),
        clientGeneratedId: this.generateClientId(),
        completed: this.generateTaskCompleted(),
        description: taskTemplate.description,
        dueDate: this.generateDueDate(),
        orderKey: this.generateOrderKey(),
        stageId: this.stageId,
        title: taskTemplate.title,
      },
      template: taskTemplate,
    };
  }

  generateClientId() {
    return createMockUUID() as KanbanTaskClientGeneratedId;
  }

  generateOrderKey(): string {
    this.orderKey = generateOrderKeyBetween(this.orderKey, null);
    return this.orderKey;
  }

  generateDueDate(): Date {
    return faker.date.soon({ days: 60 });
  }

  generateTaskCompleted(): boolean {
    return this.stageTitle === 'done';
  }

  generateAssignedUserId() {
    return faker.helpers.arrayElement(this.users).id;
  }
}

export function generateKanbanTaskChecklist(taskId: KanbanTaskId, taskTemplate: KanbanTaskTemplate) {
  const checklistItems: KanbanTaskChecklistItemTableInsert[] = [];

  taskTemplate.checklist.forEach(({ completed, title }) => {
    checklistItems.push({
      clientGeneratedId: createMockUUID() as KanbanTaskChecklistItemClientGeneratedId,
      completed,
      taskId,
      title,
    });
  });

  return checklistItems;
}

export function generateKanbanTaskComments(
  users: SeedKanbanUsers,
  taskId: KanbanTaskId,
  taskTemplate: KanbanTaskTemplate
) {
  const comments: KanbanTaskCommentsTableInsert[] = [];

  taskTemplate.comments.forEach((comment) => {
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
