/* eslint-disable perfectionist/sort-objects */
import CompanyLogo from '@Img/CompanyLogo.png';
import UserImage from '@Img/image-35.jpg';

export interface ITask {
  id: string;
  companyLogo: string;
  companyTitle: string;
  dealTitle: string;
  userImage: string;
  daysElapsed: number;
  dealTotal: number;
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
      companyLogo: CompanyLogo,
      companyTitle: 'Microsoft',
      dealTitle: 'Bloatware Junk As Per Usual',
      userImage: UserImage,
      daysElapsed: 27,
      dealTotal: 12,
    },
    'task-2': {
      id: 'task-2',
      companyLogo: CompanyLogo,
      companyTitle: 'Apple',
      dealTitle: 'Overpriced Hardware',
      userImage: UserImage,
      daysElapsed: 1,
      dealTotal: 32,
    },
    'task-3': {
      id: 'task-3',
      companyLogo: CompanyLogo,
      companyTitle: 'Linux',
      dealTitle: 'Reasonable Product',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 27,
    },
    'task-4': {
      id: 'task-4',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    'task-5': {
      id: 'task-5',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    'task-6': {
      id: 'task-6',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    'task-7': {
      id: 'task-7',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    'task-8': {
      id: 'task-8',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    'task-9': {
      id: 'task-9',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    'task-10': {
      id: 'task-10',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
  },
  columns: {
    'column-unassigned': {
      id: 'column-unassigned',
      title: 'unassigned',
      taskIds: ['task-1', 'task-2', 'task-5'],
    },
    'column-new': {
      id: 'column-new',
      title: 'new',
      taskIds: [],
    },
    'column-won': {
      id: 'column-won',
      title: 'won',
      taskIds: ['task-3'],
    },
    'column-lost': {
      id: 'column-lost',
      title: 'lost',
      taskIds: ['task-4'],
    },
  },
  columnOrder: ['column-new'],
};
