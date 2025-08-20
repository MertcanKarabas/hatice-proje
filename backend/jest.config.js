module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',

  // --- ADD THIS SECTION ---
  moduleNameMapper: {
    '^generated/prisma$': '<rootDir>/../generated/prisma',
    '^src/(.*)$': '<rootDir>/$1',
  },
  // -------------------------
};