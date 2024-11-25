/* eslint-disable perfectionist/sort-objects */
import UserImage from '#Img/image-35.jpg';

export interface ITask {
  id: string;
  userImage: string;
  title: string;
  date: string; // TODO:  Make Date type; when form functionality is complete
  notesTotal: number;
}

export interface IColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface IInitialData {
  tasks: { [key: string]: ITask };
  columns: { [key: string]: IColumn };
  columnOrder: string[];
}
export const initialData: IInitialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      userImage: UserImage,
      title: 'Organize',
      date: 'May 18',
      notesTotal: 2,
    },
    'task-2': {
      id: 'task-2',
      userImage: UserImage,
      title: 'Organize',
      date: 'May 18',
      notesTotal: 2,
    },
  },
  columns: {
    'column-unassigned': {
      id: 'column-unassigned',
      title: 'unassigned',
      taskIds: ['task-1', 'task-2'],
    },
    'column-todo': {
      id: 'column-todo',
      title: 'todo',
      taskIds: [],
    },
    'column-complete': {
      id: 'column-complete',
      title: 'complete',
      taskIds: [],
    },
  },
  columnOrder: ['column-todo', 'column-complete'],
};
