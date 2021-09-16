/* eslint-env node, jest */

const os = require('os');
const concatCss = require('../concat-css');

describe('css files concat', () => {
  test('concatenate 2 files do not remove file path', () => {
    const input = [
      {
        filePath: '/file/path/1.css',
        file: '.rule1 { padding: 12px; }',
      },
      {
        filePath: '/file/path/2.css',
        file: '.rule2 { margin: 12px; }',
      }];
    const output = `/* /file/path/1.css */${os.EOL
    }.rule1 { padding: 12px; }${os.EOL
    }/* /file/path/2.css */${os.EOL
    }.rule2 { margin: 12px; }`;

    expect(concatCss(input, true)).toBe(output);
  });

  test('concatenate 2 files remove file path', () => {
    const input = [
      {
        filePath: '/file/path/1.css',
        file: '.rule1 { padding: 12px; }',
      },
      {
        filePath: '/file/path/2.css',
        file: '.rule2 { margin: 12px; }',
      }];
    const output = `.rule1 { padding: 12px; }${os.EOL
    }.rule2 { margin: 12px; }`;

    expect(concatCss(input, false)).toBe(output);
  });

  test('callback have called 2 times for 2 files with file path as param', () => {
    const input = [
      {
        filePath: '/file/path/1.css',
        file: '.rule1 { padding: 12px; }',
      },
      {
        filePath: '/file/path/2.css',
        file: '.rule2 { margin: 12px; }',
      }];
    const callbackMock = jest.fn();

    concatCss(input, true, callbackMock);

    expect(callbackMock.mock.calls.length).toBe(2);
    expect(callbackMock.mock.calls[0][0]).toBe('/file/path/1.css');
    expect(callbackMock.mock.calls[1][0]).toBe('/file/path/2.css');
  });
});
