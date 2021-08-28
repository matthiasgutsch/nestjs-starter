process.env.NODE_ENV = 'test';

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  forceExit: true,
  verbose: true,
  rootDir: '.',
  testRegex: '.*\\.(spec|it|test|e2e|e2e-spec)\\.(t|j)s$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  roots: ['<rootDir>/test/', '<rootDir>/src/'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['node_modules', 'node_modules/*', 'dist', 'dist/*'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js', 'jest-extended'],
  moduleDirectories: ['node_modules'],
  preset: 'ts-jest',
  testResultsProcessor: 'jest-sonar-reporter',
};
