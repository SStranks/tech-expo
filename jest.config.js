import JestConfigNode from '@packages/jest-config-node/jest.config.js';
import JestConfigReact from '@packages/jest-config-react/jest.config.js';

export default {
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: '<rootDir>/coverage',
  projects: [
    {
      displayName: 'TEST-APP-FRONTEND',
      rootDir: '<rootDir>/apps/temp/frontend',
      ...JestConfigReact,
    },
    {
      displayName: 'TEST-APP-BACKEND',
      rootDir: '<rootDir>/apps/temp/backend',
      ...JestConfigNode,
    },
  ],
};
