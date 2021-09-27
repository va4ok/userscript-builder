/* eslint-env node, jest */

const increaseVersion = require('../increase-version');

const START_VERSION = '3.3.3';

describe('Version generator', () => {
  test('3.3.3 must be 3.3.3 on none key', () => {
    expect(increaseVersion(START_VERSION, '')).toBe('3.3.3');
  });

  test('3.3.3 must be 3.3.4 on dev', () => {
    expect(increaseVersion(START_VERSION, { production: false })).toBe('3.3.3');
  });

  test('3.3.3 must be 3.3.4 on bugfix', () => {
    expect(increaseVersion(START_VERSION, { patch: true })).toBe('3.3.4');
  });

  test('3.3.3 must be 3.4.0 on minor', () => {
    expect(increaseVersion(START_VERSION, { minor: true })).toBe('3.4.0');
  });

  test('3.3.3 must be 4.0.0 on major', () => {
    expect(increaseVersion(START_VERSION, { major: true })).toBe('4.0.0');
  });
});
