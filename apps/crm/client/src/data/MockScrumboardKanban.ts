/* eslint-disable perfectionist/sort-objects */
import UserImage from '@Img/image-35.jpg';

export type KanbanTask = {
  id: string;
  userImage: string;
  title: string;
  date: string; // TODO:  Make Date type; when form functionality is complete
  notesTotal: number;
};

export type KanbanStage = {
  id: string;
  title: string;
  taskIds: string[];
};

export type KanbanInitialData = {
  tasks: KanbanTask[];
  columns: KanbanStage[];
  columnOrder: string[];
};
export const initialData: KanbanInitialData = {
  tasks: [
    {
      id: 'task-1',
      userImage: UserImage,
      title: 'Organize',
      date: 'May 18',
      notesTotal: 2,
    },
    {
      id: 'task-2',
      userImage: UserImage,
      title: 'Prepare',
      date: 'May 18',
      notesTotal: 2,
    },
    {
      id: 'task-3',
      userImage: UserImage,
      title: 'Finalize',
      date: 'May 18',
      notesTotal: 2,
    },
  ],
  columns: [
    {
      id: 'column-unassigned',
      title: 'unassigned',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    {
      id: 'column-todo',
      title: 'todo',
      taskIds: [],
    },
    {
      id: 'column-complete',
      title: 'complete',
      taskIds: [],
    },
  ],
  columnOrder: ['column-todo', 'column-complete'],
};
