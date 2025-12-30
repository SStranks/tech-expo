/* eslint-disable perfectionist/sort-objects */
import UserImage from '@Img/image-35.jpg';

export type KanbanTask = {
  id: string;
  orderKey: string;
  stageId: KanbanStage['id'];
  userImage: string;
  title: string;
  date: string; // TODO:  Make Date type; when form functionality is complete
  notesTotal: number;
};

export type KanbanStage = {
  id: string;
  title: string;
  isPermanent: boolean;
};

export type KanbanInitialData = {
  tasks: KanbanTask[];
  stages: KanbanStage[];
  columnOrder: string[];
};
export const initialData: KanbanInitialData = {
  tasks: [
    {
      id: 'task-1',
      orderKey: '',
      stageId: 'column-unassigned',
      userImage: UserImage,
      title: 'Organize',
      date: 'May 18',
      notesTotal: 2,
    },
    {
      id: 'task-2',
      orderKey: '',
      stageId: 'column-unassigned',
      userImage: UserImage,
      title: 'Prepare',
      date: 'May 18',
      notesTotal: 2,
    },
    {
      id: 'task-3',
      orderKey: '',
      stageId: 'column-unassigned',
      userImage: UserImage,
      title: 'Finalize',
      date: 'May 18',
      notesTotal: 2,
    },
  ],
  stages: [
    {
      id: 'column-unassigned',
      title: 'unassigned',
      isPermanent: true,
    },
    {
      id: 'column-todo',
      title: 'todo',
      isPermanent: false,
    },
    {
      id: 'column-complete',
      title: 'complete',
      isPermanent: false,
    },
  ],
  columnOrder: ['column-todo', 'column-complete'],
};
