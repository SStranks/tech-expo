import JestConfigNode from '@packages/jest-config-node/jest.config.js';
import JestConfigReact from '@packages/jest-config-react/jest.config.js';

export default {
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: '<rootDir>/coverage',
  projects: [
    // {
    //   displayName: 'AUDIOPHILE-ECOMMERCE-API',
    //   rootDir: '<rootDir>/apps/audiophile-ecommerce/backend',
    //   ...JestConfigNode,
    // },
    {
      displayName: 'AUDIOPHILE-ECOMMERCE-CLIENT',
      rootDir: '<rootDir>/apps/audiophile-ecommerce/frontend',
      ...JestConfigReact,
    },
    // {
    //   displayName: 'DESIGNO-AGENCY-API',
    //   rootDir: '<rootDir>/apps/designo-agency/backend',
    //   ...JestConfigNode,
    // },
    {
      displayName: 'DESIGNO-AGENCY-CLIENT',
      rootDir: '<rootDir>/apps/designo-agency/frontend',
      ...JestConfigReact,
    },
    {
      displayName: 'INVOICE-APP-API',
      rootDir: '<rootDir>/apps/invoice-app/backend',
      ...JestConfigNode,
    },
    {
      displayName: 'INVOICE-APP-CLIENT',
      rootDir: '<rootDir>/apps/invoice-app/frontend',
      ...JestConfigReact,
    },
    {
      displayName: 'KANBAN-TASK-APP-API',
      rootDir: '<rootDir>/apps/kanban-task-app/backend',
      ...JestConfigNode,
    },
    {
      displayName: 'KANBAN-TASK-APP-CLIENT',
      rootDir: '<rootDir>/apps/kanban-task-app/frontend',
      ...JestConfigReact,
    },
    {
      displayName: 'PROJECT-FEEDBACK-APP-API',
      rootDir: '<rootDir>/apps/project-feedback-app/backend',
      ...JestConfigNode,
    },
    {
      displayName: 'PROJECT-FEEDBACK-APP-CLIENT',
      rootDir: '<rootDir>/apps/project-feedback-app/frontend',
      ...JestConfigReact,
    },
  ],
};
