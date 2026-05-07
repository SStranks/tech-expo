/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import { createMockUUID } from '@apps/crm-shared/utils';

import UserImage from '@Img/image-35.jpg';

export type KanbanTask = {
  id: UUID;
  orderKey: string;
  stageId: KanbanStage['id'];
  userImage: string;
  title: string;
  date: string; // TODO:  Make Date type; when form functionality is complete
  notesTotal: number;
};

export type KanbanStage = {
  id: UUID;
  title: string;
  isPermanent: boolean;
};

export type KanbanInitialData = {
  tasks: KanbanTask[];
  stages: KanbanStage[];
  stagesOrder: string[];
};

export const initialData: KanbanInitialData = {
  tasks: [
    {
      id: createMockUUID(),
      orderKey: '',
      stageId: createMockUUID(),
      userImage: UserImage,
      title: 'Organize',
      date: 'May 18',
      notesTotal: 2,
    },
    {
      id: createMockUUID(),
      orderKey: '',
      stageId: createMockUUID(),
      userImage: UserImage,
      title: 'Prepare',
      date: 'May 18',
      notesTotal: 2,
    },
    {
      id: createMockUUID(),
      orderKey: '',
      stageId: createMockUUID(),
      userImage: UserImage,
      title: 'Finalize',
      date: 'May 18',
      notesTotal: 2,
    },
  ],
  stages: [
    {
      id: createMockUUID(),
      title: 'unassigned',
      isPermanent: true,
    },
    {
      id: createMockUUID(),
      title: 'todo',
      isPermanent: false,
    },
    {
      id: createMockUUID(),
      title: 'complete',
      isPermanent: false,
    },
  ],
  stagesOrder: ['column-todo', 'column-complete'],
};
