export default {
  roots: ['<rootDir>/server'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest'],
  },
};
