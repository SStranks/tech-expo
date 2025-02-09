/* eslint-disable perfectionist/sort-objects */
import 'identity-obj-proxy';

import path from 'node:path';
import url from 'node:url';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));

export default {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }], // looks to monorepo root for babel.config
  },
  transformIgnorePatterns: ['node_modules/(?!rehype-sanitize|@uiw/react-md-editor)/'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: [
    path.resolve(CUR, './node_modules/@testing-library/jest-dom'),
    path.resolve(CUR, './jest.setup.ts'),
  ],
  snapshotResolver: '<rootDir>/__snapshots__/snapshotResolver.ts',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.resolve(
      CUR,
      './jest.fileMock.ts'
    ),
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@Img/(.*)$': '<rootDir>/src/assets/img/$1',
    '^@Sass/(.*)$': '<rootDir>/src/assets/sass/$1',
    '^@Svg/(.*)$': '<rootDir>/src/assets/svg/$1',
    '^@Components/(.*)$': '<rootDir>/src/components/$1',
    '^@Context/(.*)$': '<rootDir>/src/context/$1',
    '^@Data/(.*)$': '<rootDir>/src/data/$1',
    '^@Features/(.*)$': '<rootDir>/src/features/$1',
    '^@Hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@Layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '^@Lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@Modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@Pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@Redux/(.*)$': '<rootDir>/src/redux/$1',
    '^@Routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@Services/(.*)$': '<rootDir>/src/services/$1',
    '^@Stories/(.*)$': '<rootDir>/src/stories/$1',
    '^@Types/(.*)$': '<rootDir>/src/types/$1',
    '^@Utils/(.*)$': '<rootDir>/src/utils/$1',
  },
};
