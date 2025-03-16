
// Jest configuration is currently minimal as testing is disabled

module.exports = {
  // Basic configuration maintained for future use if testing is re-enabled
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
