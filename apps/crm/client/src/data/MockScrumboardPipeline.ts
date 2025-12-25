/* eslint-disable perfectionist/sort-objects */
import CompanyLogo from '@Img/CompanyLogo.png';
import UserImage from '@Img/image-35.jpg';

export type PipelineDeal = {
  id: string;
  orderKey: string;
  stageId: PipelineStage['id'];
  companyLogo: string;
  companyTitle: string;
  dealTitle: string;
  userImage: string;
  daysElapsed: number;
  dealTotal: number;
};

export type PipelineStage = {
  id: string;
  title: string;
  isPermanent: boolean;
};

export type PipelineInitialData = {
  deals: PipelineDeal[];
  columns: PipelineStage[];
  columnOrder: string[];
};

export const initialData: PipelineInitialData = {
  deals: [
    {
      id: 'task1',
      orderKey: 'a',
      stageId: 'column-unassigned',
      companyLogo: CompanyLogo,
      companyTitle: 'Microsoft',
      dealTitle: 'Bloatware Junk As Per Usual',
      userImage: UserImage,
      daysElapsed: 27,
      dealTotal: 12,
    },
    {
      id: 'task2',
      orderKey: 'd',
      stageId: 'column-unassigned',
      companyLogo: CompanyLogo,
      companyTitle: 'Apple',
      dealTitle: 'Overpriced Hardware',
      userImage: UserImage,
      daysElapsed: 1,
      dealTotal: 32,
    },
    {
      id: 'task3',
      orderKey: 'g',
      stageId: 'column-unassigned',
      companyLogo: CompanyLogo,
      companyTitle: 'Linux',
      dealTitle: 'Reasonable Product',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 27,
    },
    {
      id: 'task4',
      orderKey: 'j',
      stageId: 'column-new',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    {
      id: 'task5',
      orderKey: 'm',
      stageId: 'column-won',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why22',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    {
      id: 'task6',
      orderKey: 'p',
      stageId: 'column-lost',
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why33',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    // 'task7': {
    //   id: 'task7',
    //   orderKey: 's',
    //   companyLogo: CompanyLogo,
    //   companyTitle: 'Fortran',
    //   dealTitle: 'Oh Lord Why',
    //   userImage: UserImage,
    //   daysElapsed: 11,
    //   dealTotal: 33,
    // },
    // 'task8': {
    //   id: 'task8',
    //   orderKey: 'v',
    //   companyLogo: CompanyLogo,
    //   companyTitle: 'Fortran',
    //   dealTitle: 'Oh Lord Why',
    //   userImage: UserImage,
    //   daysElapsed: 11,
    //   dealTotal: 33,
    // },
    // 'task9': {
    //   id: 'task9',
    //   orderKey: 'y',
    //   companyLogo: CompanyLogo,
    //   companyTitle: 'Fortran',
    //   dealTitle: 'Oh Lord Why',
    //   userImage: UserImage,
    //   daysElapsed: 11,
    //   dealTotal: 33,
    // },
    // 'task10': {
    //   id: 'task10',
    //   orderKey: 'z',
    //   companyLogo: CompanyLogo,
    //   companyTitle: 'Fortran',
    //   dealTitle: 'Oh Lord Why',
    //   userImage: UserImage,
    //   daysElapsed: 11,
    //   dealTotal: 33,
    // },
  ],
  columns: [
    {
      id: 'column-unassigned',
      title: 'unassigned',
      isPermanent: true,
    },
    {
      id: 'column-new',
      title: 'new',
      isPermanent: false,
    },
    {
      id: 'column-won',
      title: 'won',
      isPermanent: true,
    },
    {
      id: 'column-lost',
      title: 'lost',
      isPermanent: true,
    },
  ],
  columnOrder: ['column-new'],
};
