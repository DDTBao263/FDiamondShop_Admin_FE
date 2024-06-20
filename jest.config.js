// jest.config.js
module.exports = {
  // preset: 'babel-jest', 
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^src/(.*)$': '<rootDir>/src/$1', // ánh xạ alias 'src' như trong Vite
    '^~(.*)$': '<rootDir>/node_modules/$1', // ánh xạ alias '~' như trong Vite
    // Thêm các alias khác nếu cần
  },
  // testMatch: ['<rootDir>/src/**/__tests__/**/*.test.(js|jsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['js', 'jsx'],
};
