jest.mock('fs');
require('fs').__setMockFiles('');

describe('Package json update', () => {
  require('../update-package-json')({version: '5.5.5'});
  test('Description', () => {
    expect(require('package.json')).toBe('ddd');
  });
});
