# Jest Hoisting Bug Proof of Concept for .cjs files

## Setup Instructions

1. **Install dependencies:**
   ```zsh
   npm install
   ```
2. **Run specific test files:**
   For the `.js` test:
     ```zsh
     npx jest __tests__/index.spec.js
     ```
   For the `.cjs` test:
     ```zsh
     npx jest __tests__/index.spec.cjs
     ```
   For the manually hoisted `.cjs` test:
     ```zsh
     npx jest __tests__/index.manually-hoisted.cjs
     ```

## Project and Code Explanation

This repository demonstrates a potential bug in Jest related to the hoisting of `jest.mock` when using `.cjs` test files.

- **lib/index.js**: Exports a function `businessMessage` that returns `'foo bar'`.
  ```js
  // lib/index.js
  function businessMessage() {
    return 'foo bar';
  }
  module.exports = { businessMessage };
  ```

- **__tests__/index.spec.js**: Standard Jest test in CommonJS, with `jest.mock` after the `require`. This works as expected because Jest hoists the mock.
  ```js
  // __tests__/index.spec.js
  const { businessMessage } = require('../lib');
  jest.mock('../lib', () => ({
    businessMessage: jest.fn(() => 'mocked!'),
  }));

  test('should use the mocked implementation', () => {
    expect(businessMessage()).toBe('mocked!');
  });
  ```

- **__tests__/index.spec.cjs**: Identical to the `.js` test, but with a `.cjs` extension. Here, `jest.mock` is not hoisted, so the real implementation is used instead of the mock.
  ```js
  // __tests__/index.spec.cjs
  const { businessMessage } = require('../lib');
  jest.mock('../lib', () => ({
    businessMessage: jest.fn(() => 'mocked!'),
  }));

  test('should use the mocked implementation', () => {
    expect(businessMessage()).toBe('mocked!');
  });
  // This test will fail because jest.mock is not hoisted in .cjs files
  ```

- **__tests__/index.manually-hoisted.cjs**: The mock is placed before the `require` statement, manually simulating hoisting. This test works as expected, even with the `.cjs` extension.
  ```js
  // __tests__/index.manually-hoisted.cjs
  jest.mock('../lib', () => ({
    businessMessage: jest.fn(() => 'mocked!'),
  }));
  const { businessMessage } = require('../lib');

  test('should use the mocked implementation', () => {
    expect(businessMessage()).toBe('mocked!');
  });
  ```

- **jest.config.cjs**: Configures Jest to pick up both `.js` and `.cjs` test files.
  ```js
  // jest.config.cjs
  module.exports = {
    testMatch: [
      '**/__tests__/**/*.js',
      '**/__tests__/**/*.cjs',
    ],
  };
  ```

### Key Point

- **Jest's automatic hoisting of `jest.mock` does not work in `.cjs` files**, but works in `.js` files. Manual hoisting (placing `jest.mock` before `require`) is required for `.cjs` files.

## Test Environment 

- **Node.js version:** v23.10.0
- **npm version:** 10.9.2
- **npx version:** 10.9.2
- **Jest version:** 29.7.0
- **OS:** macOS 15.5 (Darwin Kernel Version 24.5.0, arm64)

### Command: 
```zsh
node --version
npm --version
npx --version
npx jest --version
uname -a
sw_vers
```

### Output:
```zsh
v23.10.0
10.9.2
10.9.2
29.7.0
Darwin LQ9357DK4K 24.5.0 Darwin Kernel Version 24.5.0: Tue Apr 22 19:53:27 PDT 2025; root:xnu-11417.121.6~2/RELEASE_ARM64_T6041 arm64
ProductName:            macOS
ProductVersion:         15.5
BuildVersion:           24F74

```

## Context

<!-- Add any additional context or links here -->
