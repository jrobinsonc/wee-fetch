/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: ['<rootDir>/jest.config.jsdom.js', '<rootDir>/jest.config.node.js'],
  roots: ['src/'],
  collectCoverageFrom: ['src/**/*.ts'],
};
