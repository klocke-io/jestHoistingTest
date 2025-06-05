const { businessMessage } = require('../lib/index.js');

jest.mock('../lib/index.js', () => ({
  businessMessage: jest.fn(() => 'bar baz'),
}));

describe('businessMessage', () => {

  it('should return important business message', () => {
    expect(businessMessage()).toBe('bar baz');
  });
});
