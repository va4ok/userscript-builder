const version = require('../version');
const START_VERSION = '3.3.3';

describe('Version generator', () => {
  test('3.3.3 must be 3.3.3 on none key', () => {
    expect(version.increase(START_VERSION, '')).toBe('3.3.3');
  });

  test('3.3.3 must be 3.3.4 on dev', () => {
    expect(version.increase(START_VERSION, 'dev')).toBe('3.3.3');
  });

  test('3.3.3 must be 3.3.4 on bugfix', () => {
    expect(version.increase(START_VERSION, 'bugfix')).toBe('3.3.4');
  });

  test('3.3.3 must be 3.3.4 on bug', () => {
    expect(version.increase(START_VERSION, 'bug')).toBe('3.3.4');
  });

  test('3.3.3 must be 3.4.0 on minor', () => {
    expect(version.increase(START_VERSION, 'minor')).toBe('3.4.0');
  });

  test('3.3.3 must be 3.4.0 on min', () => {
    expect(version.increase(START_VERSION, 'min')).toBe('3.4.0');
  });

  test('3.3.3 must be 4.0.0 on major', () => {
    expect(version.increase(START_VERSION, 'major')).toBe('4.0.0');
  });

  test('3.3.3 must be 4.0.0 on maj', () => {
    expect(version.increase(START_VERSION, 'maj')).toBe('4.0.0');
  });
});