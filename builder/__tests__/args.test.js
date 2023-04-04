/* eslint-env node, jest */

const args = require('../args');

describe('args', () => {
  describe('map', () => {
    test('empty', () => {
      const expected = {};
      const actual = args.map();

      expect(actual).toStrictEqual(expected);
    });

    test('boolean', () => {
      const expected = { noValidate: true, production: true };
      const actual = args.map(['--no-validate', '--production']);

      expect(actual).toStrictEqual(expected);
    });

    test('string', () => {
      const expected = { mode: 'dev', foo: 'bar', oneMore: 'val' };
      const actual = args.map(['--mode', 'dev', '--foo', 'bar', '--one-more', 'val']);

      expect(actual).toStrictEqual(expected);
    });

    test('mixed', () => {
      const expected = {
        mode: 'dev',
        foo: 'bar',
        hello: true,
        noValidate: true,
      };
      const actual = args.map(['--no-validate', '--mode', 'dev', '--hello', '--foo', 'bar']);

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('validate', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    test('no issues', () => {
      args.validate({ noValidate: true, production: true });
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    test('dev issue', () => {
      args.validate({ noValidate: true, mode: 'dev' });

      const message = '\x1b[1;33m--mode dev parameter is deprecated and will will be deleted in upcoming major release. '
        + 'Use --development instead.\x1b[0m';
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });

    test('bug issue', () => {
      args.validate({ noValidate: true, mode: 'bug' });

      const message = '\x1b[1;33m--mode bug parameter is deprecated and will will be deleted in upcoming major release. '
        + 'Use --release-patch instead.\x1b[0m';
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });

    test('bugfix issue', () => {
      args.validate({ noValidate: true, mode: 'bugfix' });

      const message = '\x1b[1;33m--mode bugfix parameter is deprecated and will will be deleted in upcoming major release. '
        + 'Use --release-patch instead.\x1b[0m';
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });

    test('min issue', () => {
      args.validate({ noValidate: true, mode: 'min' });

      const message = '\x1b[1;33m--mode min parameter is deprecated and will will be deleted in upcoming major release. '
        + 'Use --release-minor instead.\x1b[0m';
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });

    test('minor issue', () => {
      args.validate({ noValidate: true, mode: 'minor' });

      const message = '\x1b[1;33m--mode minor parameter is deprecated and will will be deleted in upcoming major release. '
        + 'Use --release-minor instead.\x1b[0m';
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });

    test('maj issue', () => {
      args.validate({ noValidate: true, mode: 'maj' });

      const message = '\x1b[1;33m--mode maj parameter is deprecated and will will be deleted in upcoming major release. '
        + 'Use --release-major instead.\x1b[0m';
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });

    test('major issue', () => {
      args.validate({ noValidate: true, mode: 'major' });

      const message = '\x1b[1;33m--mode major parameter is deprecated and will will be deleted in upcoming major release. '
        + 'Use --release-major instead.\x1b[0m';
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });
  });

  describe('parse', () => {
    test('no params', () => {
      const actual = args.parse();
      const expected = {
        noValidate: false,
        production: true,
        keepCodeComments: false,
        keepFilePathComments: false,
        patch: false,
        minor: false,
        major: false,
      };

      expect(actual).toStrictEqual(expected);
    });

    test('build params', () => {
      const processArguments = [
        '',
        '',
        '--no-validate',
        '--development',
        '--release-patch',
        '--release-minor',
        '--release-major',
      ];
      const actual = args.parse(processArguments);
      const expected = {
        noValidate: true,
        production: false,
        keepCodeComments: true,
        keepFilePathComments: true,
        patch: true,
        minor: true,
        major: true,
      };

      expect(actual).toStrictEqual(expected);
    });

    test('old api dev', () => {
      const processArguments = ['', '', '--mode', 'dev'];
      const actual = args.parse(processArguments);
      const expected = {
        noValidate: false,
        production: false,
        keepCodeComments: true,
        keepFilePathComments: true,
        patch: false,
        minor: false,
        major: false,
      };

      expect(actual).toStrictEqual(expected);
    });

    test('old api bug', () => {
      const processArguments = ['', '', '--mode', 'bug'];
      const actual = args.parse(processArguments);
      const expected = {
        noValidate: false,
        production: true,
        keepCodeComments: false,
        keepFilePathComments: false,
        patch: true,
        minor: false,
        major: false,
      };

      expect(actual).toStrictEqual(expected);
    });

    test('old api bugfix', () => {
      const processArguments = ['', '', '--mode', 'bugfix'];
      const actual = args.parse(processArguments);
      const expected = {
        noValidate: false,
        production: true,
        keepCodeComments: false,
        keepFilePathComments: false,
        patch: true,
        minor: false,
        major: false,
      };

      expect(actual).toStrictEqual(expected);
    });

    test('old api min', () => {
      const processArguments = ['', '', '--mode', 'min'];
      const actual = args.parse(processArguments);
      const expected = {
        noValidate: false,
        production: true,
        keepCodeComments: false,
        keepFilePathComments: false,
        patch: false,
        minor: true,
        major: false,
      };

      expect(actual).toStrictEqual(expected);
    });

    test('old api minor', () => {
      const processArguments = ['', '', '--mode', 'minor'];
      const actual = args.parse(processArguments);
      const expected = {
        noValidate: false,
        production: true,
        keepCodeComments: false,
        keepFilePathComments: false,
        patch: false,
        minor: true,
        major: false,
      };

      expect(actual).toStrictEqual(expected);
    });

    test('old api maj', () => {
      const processArguments = ['', '', '--mode', 'maj'];
      const actual = args.parse(processArguments);
      const expected = {
        noValidate: false,
        production: true,
        keepCodeComments: false,
        keepFilePathComments: false,
        patch: false,
        minor: false,
        major: true,
      };

      expect(actual).toStrictEqual(expected);
    });

    test('old api major', () => {
      const processArguments = ['', '', '--mode', 'major'];
      const actual = args.parse(processArguments);
      const expected = {
        noValidate: false,
        production: true,
        keepCodeComments: false,
        keepFilePathComments: false,
        patch: false,
        minor: false,
        major: true,
      };

      expect(actual).toStrictEqual(expected);
    });
  });
});
