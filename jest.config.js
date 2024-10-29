import JestConfigNode from '@packages/jest-config-node/jest.config.js';
import JestConfigReact from '@packages/jest-config-react/jest.config.js';

export default {
  coverageDirectory: '<rootDir>/coverage',
  projects: [
    {
      displayName: 'CRM-Client',
      rootDir: '<rootDir>/apps/crm/client',
      ...JestConfigReact,
    },
    {
      displayName: 'CRM-Server',
      rootDir: '<rootDir>/apps/crm/server',
      ...JestConfigNode,
    },
  ],
  testPathIgnorePatterns: ['/node_modules/'],
};
