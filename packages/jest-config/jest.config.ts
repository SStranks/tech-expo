import type { Config } from 'jest';

const BaseConfig: Config = {
  // Module file extensions for importing
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  snapshotResolver: '<rootDir>/__snapshots__/snapshotResolver.ts',
  testEnvironment: 'node',
  verbose: true,
};

export default BaseConfig;
