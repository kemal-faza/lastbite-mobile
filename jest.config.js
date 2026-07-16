/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: 'tsconfig.test.json' },
    ],
  },
  moduleNameMapper: {
    // Image assets via relative path or @/ alias — must come before catch-all
    '\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    // TypeScript modules via @/ alias
    '^@/(.*)$': '<rootDir>/src/$1',
    // Other mocks
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)', 'tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
