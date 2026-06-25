const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/unit/**/*.test.js', '<rootDir>/tests/integration/**/*.test.js'],
  collectCoverageFrom: ['controllers/**/*.js', 'services/**/*.js', 'middlewares/**/*.js', 'repositories/**/*.js', 'utils/**/*.js'],
  coverageThreshold: {
    'services/': {
      statements: 80
    },
    'middlewares/': {
      statements: 85
    },
    'utils/': {
      statements: 75
    }
  },
  coverageDirectory: '<rootDir>/coverage',
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  clearMocks: true,
};
