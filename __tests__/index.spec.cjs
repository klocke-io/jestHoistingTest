const { add } = require('../lib/index.js');

jest.mock('../lib/index.js', () => ({
  add: jest.fn((a, b) => a * b),
}));

describe('add', () => {

  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should add negative and positive numbers', () => {
    expect(add(-2, 3)).toBe(1);
  });

  it('should add two negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });

  it('should add zero', () => {
    expect(add(0, 5)).toBe(5);
    expect(add(5, 0)).toBe(5);
  });
});
