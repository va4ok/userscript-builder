/* eslint-env node, jest */

jest.mock('fs');
const fs = require('fs');
const path = require('path');
const uPJ = require('../update-project-package');
const mockPackageJson = require('../__mocks__/mock-package.json');

describe('Package json update', () => {
  jest.mock(
    path.join(process.cwd(), 'package.json'),
    () => mockPackageJson,
  );

  uPJ({ version: '7.7.7' });

  test('Path to save - <current working directory>/package.json', () => {
    expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.join(process.cwd(), 'package.json'));
  });

  test('Version updated', () => {
    const expected = JSON.stringify({
      name: 'my-userscript',
      version: '7.7.7',
      description: 'Some description',
      repository: {
        type: 'git',
        url: 'git+https://github.com/va4ok/userscript-builder.git',
      },
      author: 'va4ok',
      license: 'MIT',
      bugs: {
        url: 'https://github.com/va4ok/userscript-builder/issues',
      },
      homepage: 'https://github.com/va4ok/userscript-builder#readme',
      dependencies: {
        minimist: '^1.2.0',
      },
      userscript: {
        entry: './example/index.js',
        dev: './dist',
        release: './release',
        fileName: 'example',
        meta: {
          name: 'Example',
          namespace: 'http://tampermonkey.net/',
          homepage: 'https://openuserjs.org/scripts/va4ok',
          match: '*://*.*',
          grant: 'none',
          require: [
            'https://some.url.1',
            'https://some.url.2',
          ],
          emptyValue: '',
        },
      },
    }, null, 2);

    expect(fs.writeFileSync.mock.calls[0][1]).toBe(expected);
  });
});
