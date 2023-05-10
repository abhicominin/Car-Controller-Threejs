const tsPreset = require('ts-jest/jest-preset')

module.exports = {
  ...tsPreset,
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['./test/customMatchers.ts'],
}
