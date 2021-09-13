'use strict';

jest.mock('fs');
jest.mock('../css-in-js');
const utils = require('../utils');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('utils', () => {
  describe('getConfig', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    test('package.json is not available in project root', () => {
      jest.mock(path.join(process.cwd(), 'package.json'), () => {
        throw new Error('File not found');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const expected = {
        dev: './dist',
        entry: './src/index.js',
        fileName: 'new-userscript',
        meta: {
          author: 'You',
          description: 'try to take over the world!',
          grant: 'none',
          match: 'http://*/*',
          name: 'New Userscript',
          namespace: 'http://tampermonkey.net/',
          version: '0.0.0',
        },
        release: './release',
      };

      const config = utils.getConfig();

      expect(config).toStrictEqual(expected);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    test('package.json is available in project root', () => {
      const mockPackageJson = require('../__mocks__/mock-package.json');

      jest.mock(
        path.join(process.cwd(), 'package.json'),
        () => mockPackageJson
      );

      const expected = {
        dev: './dist',
        entry: './example/index.js',
        fileName: 'example',
        meta: {
          author: 'va4ok',
          description: 'Some description',
          emptyValue: '',
          grant: 'none',
          homepage: 'https://openuserjs.org/scripts/va4ok',
          license: 'MIT',
          match: '*://*.*',
          name: 'Example',
          namespace: 'http://tampermonkey.net/',
          require: ['https://some.url.1', 'https://some.url.2'],
          source: 'git+https://github.com/va4ok/userscript-builder.git',
          version: '4.4.4',
        },
        release: './release',
      };

      const config = utils.getConfig();

      expect(config).toStrictEqual(expected);
    });
  });

  describe('createFolderAndFile', () => {
    const config = {
      release: './release-path',
      dev: './dev-path',
      fileName: 'file-name',
    };

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    test('with release file path', () => {
      const result = utils.createFolderAndFile(true, config);
      const expected = path.join(process.cwd(), 'release-path/file-name.user.js');

      expect(result).toBe(expected);
    });

    test('with dev file path', () => {
      const result = utils.createFolderAndFile(false, config);
      const expected = path.join(process.cwd(), 'dev-path/file-name.user.js');

      expect(result).toBe(expected);
    });

    test('remove existing file', () => {
      fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
      utils.createFolderAndFile(false, config);

      expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
    });

    test('no existing file', () => {
      utils.createFolderAndFile(false, config);

      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    test('create new folder', () => {
      utils.createFolderAndFile(false, config);

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
    });

    test('keep existing folder', () => {
      fs.existsSync.mockReturnValueOnce(true);
      utils.createFolderAndFile(false, config);

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getExistingFilePath', () => {
    const filePath = 'filePath';
    const normalizedFilePath = 'normalizedFilePath';
    const parentPath = 'parentPath';
    const errorMessage = `${parentPath} tries to import unreachable file ${filePath}`;

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    test('if file path reachable', () => {
      fs.existsSync.mockReturnValueOnce(true);

      const result = utils.getExistingFilePath(
        filePath,
        normalizedFilePath,
        parentPath
      );

      expect(result).toBe(filePath);
    });

    test('if normalized file path reachable', () => {
      fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(true);

      const result = utils.getExistingFilePath(
        filePath,
        normalizedFilePath,
        parentPath
      );

      expect(result).toBe(normalizedFilePath);
    });

    test('if file path and normalized file path are unreachable', () => {
      fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);

      const result = () => {
        utils.getExistingFilePath(filePath, normalizedFilePath, parentPath);
      };

      expect(result).toThrowError(new Error(errorMessage));
    });
  });

  describe('getImports', () => {
    test('empty file', () => {
      const file = '';

      const result = utils.getImports(file);

      expect(result).toStrictEqual([]);
    });

    test('file without imports', () => {
      const file = 'export const t = 10;';

      const result = utils.getImports(file);

      expect(result).toStrictEqual([]);
    });

    test('file with single imports', () => {
      const file = `import SayHello from './say-hello/say-hello';
      export const t = 10;`;

      const result = utils.getImports(file);

      expect(result).toStrictEqual(['./say-hello/say-hello']);
    });

    test('file with multi imports', () => {
      const file = `import SayHello from './say-hello/say-hello';
      import { SayHello } from './say-hello/say-hello-second';
      export const t = 10;`;

      const result = utils.getImports(file);

      expect(result).toStrictEqual([
        './say-hello/say-hello',
        './say-hello/say-hello-second',
      ]);
    });
  });

  describe('concatFiles', () => {
    const meta = {};
    const js = [
      {filePath: 'c:/s\\file1.js', file: 'js content 1;'},
      {filePath: 'c:/s\\file2.js', file: 'js content 2;'},
    ];
    const css = [
      {filePath: 'c:/s\\file1.css', file: 'css content 1'},
      {filePath: 'c:/s\\file2.css', file: 'css content 2'},
    ];

    jest.spyOn(console, 'log');

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    test('no files no meta', () => {
      const result = utils.concatFiles(true, {js: [], css: []});

      expect(result).toBe('');
    });

    test('no files', () => {
      const result = utils.concatFiles(true, {js: [], css: []}, meta);
      const expected = '// ==UserScript==' + os.EOL + '// ==/UserScript==';

      expect(result).toBe(expected);
    });

    test('js and css files with path comments', () => {
      const result = utils.concatFiles(true, {js, css}, meta);
      const expected = [
        '// ==UserScript==',
        '// ==/UserScript==',
        '',
        '// c:/s\\file1.js',
        'js content 1;',
        '',
        '// c:/s\\file2.js',
        'js content 2;',
        '',
        '/* c:/s\\file1.css */',
        'css content 1',
        '/* c:/s\\file2.css */',
        'css content 2'
      ].join(os.EOL);

      expect(result).toBe(expected);
    });

    test('js and css files without path comments', () => {
      const result = utils.concatFiles(false, {js, css}, meta);
      const expected = [
        '// ==UserScript==',
        '// ==/UserScript==',
        '',
        'js content 1;',
        '',
        'js content 2;',
        '',
        'css content 1',
        'css content 2'
      ].join(os.EOL);

      expect(result).toBe(expected);
    });
  });

  describe('build reports', () => {
    jest.spyOn(console, 'log');

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    test('start message for release major', () => {
      utils.startBuildReport(true, 'major');

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).lastCalledWith('Build in release-major mode');
    });

    test('start message for dev', () => {
      utils.startBuildReport(false, 'dev');

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).lastCalledWith('Build in dev mode');
    });

    test('finish message no version', () => {
      utils.finishBuildReport();

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).lastCalledWith('Build finished');
    });

    test('finish message with version', () => {
      utils.finishBuildReport('7.7.7');

      const expectedMessage = [
        'Build finished',
        'Version: \x1b[36m7.7.7\x1b[0m'
      ].join(os.EOL);

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).lastCalledWith(expectedMessage);
    });
  });
});
