require('dotenv').config({ path: 'tests/.env.test' });

module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['src/controllers/**/*.js', 'src/services/**/*.js', 'src/middlewares/**/*.js', 'src/repositories/**/*.js'],
  coverageDirectory: 'coverage',
  setupFiles: ['<rootDir>/setupEnv.js'],
  clearMocks: true,
};
