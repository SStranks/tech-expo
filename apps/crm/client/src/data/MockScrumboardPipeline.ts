/* eslint-disable perfectionist/sort-objects */
import type { UUID } from '@apps/crm-shared';

import CompanyLogo from '@Img/CompanyLogo.png';
import UserImage from '@Img/image-35.jpg';

import { createMockUUID } from './utils';

export type PipelineDeal = {
  id: UUID;
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
  id: UUID;
  title: string;
  isPermanent: boolean;
};

export type PipelineInitialData = {
  deals: PipelineDeal[];
  stages: PipelineStage[];
  stagesOrder: string[];
};

export const initialData: PipelineInitialData = {
  deals: [
    {
      id: createMockUUID(),
      orderKey: 'a',
      stageId: createMockUUID(),
      companyLogo: CompanyLogo,
      companyTitle: 'Microsoft',
      dealTitle: 'Bloatware Junk As Per Usual',
      userImage: UserImage,
      daysElapsed: 27,
      dealTotal: 12,
    },
    {
      id: createMockUUID(),
      orderKey: 'd',
      stageId: createMockUUID(),
      companyLogo: CompanyLogo,
      companyTitle: 'Apple',
      dealTitle: 'Overpriced Hardware',
      userImage: UserImage,
      daysElapsed: 1,
      dealTotal: 32,
    },
    {
      id: createMockUUID(),
      orderKey: 'g',
      stageId: createMockUUID(),
      companyLogo: CompanyLogo,
      companyTitle: 'Linux',
      dealTitle: 'Reasonable Product',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 27,
    },
    {
      id: createMockUUID(),
      orderKey: 'j',
      stageId: createMockUUID(),
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    {
      id: createMockUUID(),
      orderKey: 'm',
      stageId: createMockUUID(),
      companyLogo: CompanyLogo,
      companyTitle: 'Fortran',
      dealTitle: 'Oh Lord Why22',
      userImage: UserImage,
      daysElapsed: 11,
      dealTotal: 33,
    },
    {
      id: createMockUUID(),
      orderKey: 'p',
      stageId: createMockUUID(),
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
  stages: [
    {
      id: createMockUUID(),
      title: 'unassigned',
      isPermanent: true,
    },
    {
      id: createMockUUID(),
      title: 'new',
      isPermanent: false,
    },
    {
      id: createMockUUID(),
      title: 'won',
      isPermanent: true,
    },
    {
      id: createMockUUID(),
      title: 'lost',
      isPermanent: true,
    },
  ],
  stagesOrder: ['column-new'],
};
