/* eslint-env node, jest */

const fileName = require('../file-name');

describe('Normalize file name', () => {
  test('skip processing if js filename', () => {
    const input = '\\some/path\\filename.js';
    const output = '\\some/path\\filename.js';

    expect(fileName.normalizeFileName(input)).toBe(output);
  });

  test('skip processing if css filename', () => {
    const input = '\\some/path\\filename.css';
    const output = '\\some/path\\filename.css';

    expect(fileName.normalizeFileName(input)).toBe(output);
  });

  test('add js extension if not css or js filename', () => {
    const input = '\\some/path\\filename.cs';
    const output = '\\some/path\\filename.cs.js';

    expect(fileName.normalizeFileName(input)).toBe(output);
  });
});

describe('revert slashes', () => {
  test('Revert \\ and skipp /', () => {
    const input = '\\some/path\\filename.js';
    const output = '/some/path/filename.js';

    expect(fileName.revertSlashes(input)).toBe(output);
  });
});
