/* eslint-env node, jest */
const prepareConfig = require('../prepare-config');

describe('config', () => {
  test('userscript section in package.json', () => {
    const packageJsonWithUserscriptSection = {
      name: 'userscript-builder',
      version: '0.4.0',
      description: 'Tool for building userscript for tampermonkey.',
      main: 'builder/build.js',
      bin: './bin/builder.js',
      engines: {
        node: '>=6.11.5',
      },
      scripts: {
        test: 'jest',
        'test:coverage': 'jest --coverage',
        'example:dev': 'node ./bin/builder.js --mode dev',
        'example:release-bug': 'node ./bin/builder.js --mode bugfix',
        'example:release-minor': 'node ./bin/builder.js --mode minor',
        'example:release-major': 'node ./bin/builder.js --mode major',
      },
      repository: {
        type: 'git',
        url: 'git+https://github.com/va4ok/userscript-builder.git',
      },
      keywords: [
        'userscript',
        'tampermonkey',
        'builder',
      ],
      author: 'va4ok',
      license: 'MIT',
      bugs: {
        url: 'https://github.com/va4ok/userscript-builder/issues',
      },
      homepage: 'https://github.com/va4ok/userscript-builder#readme',
      dependencies: {
        minimist: '^1.2.0',
      },
      jest: {
        moduleNameMapper: {
          'package.json': '<rootDir>/builder/__mocks__/mock-package.json',
        },
        collectCoverageFrom: [
          '**/*.js',
          '!**/bin/**',
          '!**/coverage/**',
          '!**/dist/**',
          '!**/example/**',
          '!**/node_modules/**',
          '!**/release/**',
        ],
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
      devDependencies: {
        jest: '^25.1.0',
      },
    };

    const expectedConfig = {
      dev: './dist',
      entry: './example/index.js',
      fileName: 'example',
      meta: {
        author: 'va4ok',
        description: 'Tool for building userscript for tampermonkey.',
        emptyValue: '',
        grant: 'none',
        homepage: 'https://openuserjs.org/scripts/va4ok',
        license: 'MIT',
        match: '*://*.*',
        name: 'Example',
        namespace: 'http://tampermonkey.net/',
        require: ['https://some.url.1', 'https://some.url.2'],
        source: 'git+https://github.com/va4ok/userscript-builder.git',
        version: '0.4.0',
      },
      release: './release',
    };

    expect(prepareConfig(packageJsonWithUserscriptSection)).toStrictEqual(expectedConfig);
  });

  test('user as object in package.json', () => {
    const packageJsonWithUserscriptSection = {
      name: 'userscript-builder',
      version: '0.4.0',
      description: 'Tool for building userscript for tampermonkey.',
      main: 'builder/build.js',
      bin: './bin/builder.js',
      engines: {
        node: '>=6.11.5',
      },
      scripts: {
        test: 'jest',
        'test:coverage': 'jest --coverage',
        'example:dev': 'node ./bin/builder.js --mode dev',
        'example:release-bug': 'node ./bin/builder.js --mode bugfix',
        'example:release-minor': 'node ./bin/builder.js --mode minor',
        'example:release-major': 'node ./bin/builder.js --mode major',
      },
      repository: {
        type: 'git',
        url: 'git+https://github.com/va4ok/userscript-builder.git',
      },
      keywords: [
        'userscript',
        'tampermonkey',
        'builder',
      ],
      author: {
        name: 'va4ok',
      },
      license: 'MIT',
      bugs: {
        url: 'https://github.com/va4ok/userscript-builder/issues',
      },
      homepage: 'https://github.com/va4ok/userscript-builder#readme',
      dependencies: {
        minimist: '^1.2.0',
      },
      jest: {
        moduleNameMapper: {
          'package.json': '<rootDir>/builder/__mocks__/mock-package.json',
        },
        collectCoverageFrom: [
          '**/*.js',
          '!**/bin/**',
          '!**/coverage/**',
          '!**/dist/**',
          '!**/example/**',
          '!**/node_modules/**',
          '!**/release/**',
        ],
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
      devDependencies: {
        jest: '^25.1.0',
      },
    };

    const expectedConfig = {
      dev: './dist',
      entry: './example/index.js',
      fileName: 'example',
      meta: {
        author: 'va4ok',
        description: 'Tool for building userscript for tampermonkey.',
        emptyValue: '',
        grant: 'none',
        homepage: 'https://openuserjs.org/scripts/va4ok',
        license: 'MIT',
        match: '*://*.*',
        name: 'Example',
        namespace: 'http://tampermonkey.net/',
        require: ['https://some.url.1', 'https://some.url.2'],
        source: 'git+https://github.com/va4ok/userscript-builder.git',
        version: '0.4.0',
      },
      release: './release',
    };

    expect(prepareConfig(packageJsonWithUserscriptSection)).toStrictEqual(expectedConfig);
  });

  test('no meta in userscript section in package.json', () => {
    const packageJsonWithUserscriptSection = {
      name: 'userscript-builder',
      version: '0.4.0',
      description: 'Tool for building userscript for tampermonkey.',
      main: 'builder/build.js',
      bin: './bin/builder.js',
      engines: {
        node: '>=6.11.5',
      },
      scripts: {
        test: 'jest',
        'test:coverage': 'jest --coverage',
        'example:dev': 'node ./bin/builder.js --mode dev',
        'example:release-bug': 'node ./bin/builder.js --mode bugfix',
        'example:release-minor': 'node ./bin/builder.js --mode minor',
        'example:release-major': 'node ./bin/builder.js --mode major',
      },
      repository: {
        type: 'git',
        url: 'git+https://github.com/va4ok/userscript-builder.git',
      },
      keywords: [
        'userscript',
        'tampermonkey',
        'builder',
      ],
      author: 'va4ok',
      license: 'MIT',
      bugs: {
        url: 'https://github.com/va4ok/userscript-builder/issues',
      },
      homepage: 'https://github.com/va4ok/userscript-builder#readme',
      dependencies: {
        minimist: '^1.2.0',
      },
      jest: {
        moduleNameMapper: {
          'package.json': '<rootDir>/builder/__mocks__/mock-package.json',
        },
        collectCoverageFrom: [
          '**/*.js',
          '!**/bin/**',
          '!**/coverage/**',
          '!**/dist/**',
          '!**/example/**',
          '!**/node_modules/**',
          '!**/release/**',
        ],
      },
      userscript: {
        entry: './example/index.js',
        dev: './dist',
        release: './release',
        fileName: 'example',
      },
      devDependencies: {
        jest: '^25.1.0',
      },
    };

    const expectedConfig = {
      dev: './dist',
      entry: './example/index.js',
      fileName: 'example',
      meta: {
        author: 'va4ok',
        description: 'Tool for building userscript for tampermonkey.',
        grant: 'none',
        license: 'MIT',
        match: 'http://*/*',
        name: 'userscript-builder',
        namespace: 'http://tampermonkey.net/',
        source: 'git+https://github.com/va4ok/userscript-builder.git',
        version: '0.4.0',
      },
      release: './release',
    };

    expect(prepareConfig(packageJsonWithUserscriptSection)).toStrictEqual(expectedConfig);
  });

  test('no userscript section in package.json', () => {
    const packageJsonWithOutUserscriptSection = {
      name: 'userscript-builder',
      version: '0.4.0',
      description: 'Tool for building userscript for tampermonkey.',
      main: 'builder/build.js',
      bin: './bin/builder.js',
      engines: {
        node: '>=6.11.5',
      },
      scripts: {
        test: 'jest',
        'test:coverage': 'jest --coverage',
        'example:dev': 'node ./bin/builder.js --mode dev',
        'example:release-bug': 'node ./bin/builder.js --mode bugfix',
        'example:release-minor': 'node ./bin/builder.js --mode minor',
        'example:release-major': 'node ./bin/builder.js --mode major',
      },
      repository: {
        type: 'git',
        url: 'git+https://github.com/va4ok/userscript-builder.git',
      },
      keywords: [
        'userscript',
        'tampermonkey',
        'builder',
      ],
      author: 'va4ok',
      license: 'MIT',
      bugs: {
        url: 'https://github.com/va4ok/userscript-builder/issues',
      },
      homepage: 'https://github.com/va4ok/userscript-builder#readme',
      dependencies: {
        minimist: '^1.2.0',
      },
      jest: {
        moduleNameMapper: {
          'package.json': '<rootDir>/builder/__mocks__/mock-package.json',
        },
        collectCoverageFrom: [
          '**/*.js',
          '!**/bin/**',
          '!**/coverage/**',
          '!**/dist/**',
          '!**/example/**',
          '!**/node_modules/**',
          '!**/release/**',
        ],
      },
      devDependencies: {
        jest: '^25.1.0',
      },
    };

    const expectedConfig = {
      dev: './dist',
      entry: './src/index.js',
      fileName: 'new-userscript',
      meta: {
        author: 'va4ok',
        description: 'Tool for building userscript for tampermonkey.',
        grant: 'none',
        license: 'MIT',
        match: 'http://*/*',
        name: 'userscript-builder',
        namespace: 'http://tampermonkey.net/',
        source: 'git+https://github.com/va4ok/userscript-builder.git',
        version: '0.4.0',
      },
      release: './release',
    };

    expect(prepareConfig(packageJsonWithOutUserscriptSection)).toStrictEqual(expectedConfig);
  });

  test('repository as an url string in package.json', () => {
    const packageJsonWithOutUserscriptSection = {
      name: 'userscript-builder',
      version: '0.4.0',
      description: 'Tool for building userscript for tampermonkey.',
      main: 'builder/build.js',
      bin: './bin/builder.js',
      engines: {
        node: '>=6.11.5',
      },
      scripts: {
        test: 'jest',
        'test:coverage': 'jest --coverage',
        'example:dev': 'node ./bin/builder.js --mode dev',
        'example:release-bug': 'node ./bin/builder.js --mode bugfix',
        'example:release-minor': 'node ./bin/builder.js --mode minor',
        'example:release-major': 'node ./bin/builder.js --mode major',
      },
      repository: 'https://github.com/va4ok/userscript-builder.git',
      keywords: [
        'userscript',
        'tampermonkey',
        'builder',
      ],
      author: 'va4ok',
      license: 'MIT',
      bugs: {
        url: 'https://github.com/va4ok/userscript-builder/issues',
      },
      homepage: 'https://github.com/va4ok/userscript-builder#readme',
      dependencies: {
        minimist: '^1.2.0',
      },
      jest: {
        moduleNameMapper: {
          'package.json': '<rootDir>/builder/__mocks__/mock-package.json',
        },
        collectCoverageFrom: [
          '**/*.js',
          '!**/bin/**',
          '!**/coverage/**',
          '!**/dist/**',
          '!**/example/**',
          '!**/node_modules/**',
          '!**/release/**',
        ],
      },
      devDependencies: {
        jest: '^25.1.0',
      },
    };

    const expectedConfig = {
      dev: './dist',
      entry: './src/index.js',
      fileName: 'new-userscript',
      meta: {
        author: 'va4ok',
        description: 'Tool for building userscript for tampermonkey.',
        grant: 'none',
        license: 'MIT',
        match: 'http://*/*',
        name: 'userscript-builder',
        namespace: 'http://tampermonkey.net/',
        source: 'https://github.com/va4ok/userscript-builder.git',
        version: '0.4.0',
      },
      release: './release',
    };

    expect(prepareConfig(packageJsonWithOutUserscriptSection)).toStrictEqual(expectedConfig);
  });

  test('no repository field in package.json', () => {
    const packageJsonWithOutUserscriptSection = {
      name: 'userscript-builder',
      version: '0.4.0',
      description: 'Tool for building userscript for tampermonkey.',
      main: 'builder/build.js',
      bin: './bin/builder.js',
      engines: {
        node: '>=6.11.5',
      },
      scripts: {
        test: 'jest',
        'test:coverage': 'jest --coverage',
        'example:dev': 'node ./bin/builder.js --mode dev',
        'example:release-bug': 'node ./bin/builder.js --mode bugfix',
        'example:release-minor': 'node ./bin/builder.js --mode minor',
        'example:release-major': 'node ./bin/builder.js --mode major',
      },
      keywords: [
        'userscript',
        'tampermonkey',
        'builder',
      ],
      author: 'va4ok',
      license: 'MIT',
      bugs: {
        url: 'https://github.com/va4ok/userscript-builder/issues',
      },
      homepage: 'https://github.com/va4ok/userscript-builder#readme',
      dependencies: {
        minimist: '^1.2.0',
      },
      jest: {
        moduleNameMapper: {
          'package.json': '<rootDir>/builder/__mocks__/mock-package.json',
        },
        collectCoverageFrom: [
          '**/*.js',
          '!**/bin/**',
          '!**/coverage/**',
          '!**/dist/**',
          '!**/example/**',
          '!**/node_modules/**',
          '!**/release/**',
        ],
      },
      devDependencies: {
        jest: '^25.1.0',
      },
    };

    const expectedConfig = {
      dev: './dist',
      entry: './src/index.js',
      fileName: 'new-userscript',
      meta: {
        author: 'va4ok',
        description: 'Tool for building userscript for tampermonkey.',
        grant: 'none',
        license: 'MIT',
        match: 'http://*/*',
        name: 'userscript-builder',
        namespace: 'http://tampermonkey.net/',
        source: '',
        version: '0.4.0',
      },
      release: './release',
    };

    expect(prepareConfig(packageJsonWithOutUserscriptSection)).toStrictEqual(expectedConfig);
  });

  test('no package.json provided', () => {
    const expectedConfig = {
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

    expect(prepareConfig()).toStrictEqual(expectedConfig);
  });
});
