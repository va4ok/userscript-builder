/* eslint-env node, jest */

const os = require('os');
const meta = require('../meta');

const consoleLog = jest.spyOn(console, 'log');

describe('format meta', () => {
  describe('format', () => {
    test('no meta', () => {
      expect(meta.format()).toBe('');
    });

    test('empty meta', () => {
      const metaObj = {};
      const formattedMeta = `// ==UserScript==${os.EOL
      }// ==/UserScript==`;

      expect(meta.format(metaObj)).toBe(formattedMeta);
    });

    test('single values', () => {
      const metaObj = {
        name: 'name',
        some: 'more meta filed',
      };
      const formattedMeta = `// ==UserScript==${os.EOL
      }// @name  name${os.EOL
      }// @some  more meta filed${os.EOL
      }// ==/UserScript==`;

      expect(meta.format(metaObj)).toBe(formattedMeta);
    });

    test('multiple values', () => {
      const metaObj = {
        name: 'name',
        some: ['more', 'meta', 'filed'],
      };
      const formattedMeta = `// ==UserScript==${os.EOL
      }// @name  name${os.EOL
      }// @some  more${os.EOL
      }// @some  meta${os.EOL
      }// @some  filed${os.EOL
      }// ==/UserScript==`;

      expect(meta.format(metaObj)).toBe(formattedMeta);
    });

    test('all values should be aligned with at least 2 whitespaces', () => {
      const metaObj = {
        s: 's',
        veryVeryLongField: 'veryVeryLongField',
      };
      const formattedMeta = `// ==UserScript==${os.EOL
      }// @s                  s${os.EOL
      }// @veryVeryLongField  veryVeryLongField${os.EOL
      }// ==/UserScript==`;

      expect(meta.format(metaObj)).toBe(formattedMeta);
    });

    test('remove from source field "git+" value', () => {
      const metaObj = {
        source: 'git+https://some.url',
        source2: 'git+https://some.url',
      };
      const formattedMeta = `// ==UserScript==${os.EOL
      }// @source   https://some.url${os.EOL
      }// @source2  git+https://some.url${os.EOL
      }// ==/UserScript==`;

      expect(meta.format(metaObj)).toBe(formattedMeta);
    });

    test('do not add empty values', () => {
      const metaObj = {
        empty: '',
        notEmpty: 'some value',
      };
      const formattedMeta = `// ==UserScript==${os.EOL
      }// @notEmpty  some value${os.EOL
      }// ==/UserScript==`;

      expect(meta.format(metaObj)).toBe(formattedMeta);
    });
  });

  describe('validate', () => {
    const visitMessage = '\x1b[0mPlease visit https://www.tampermonkey.net/documentation.php?ext=dhdg for more details\x1b[0m';

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    test('no meta', () => {
      meta.validate();

      expect(consoleLog).not.toHaveBeenCalled();
    });

    test('valid meta', () => {
      const metaObj = {
        name: 'name',
        'name:de': 'name:de',
        namespace: 'namespace',
        version: '00.23.e.21',
        author: 'author',
        description: 'description',
        'description:de': 'description:de',
        homepage: 'git+https://homepage.url',
        icon: 'icon',
        icon64: 'icon64',
        updateURL: 'http://updateURL.url',
        downloadURL: 'https://downloadURL.url/#downloadURL',
        supportURL: 'git+https://supportURL.url',
        include: 'http://include.url',
        match: 'http://match.url',
        exclude: 'http://exclude.url',
        require: ['some_resource', 'some_resource'],
        resource: ['some_resource', 'some_resource'],
        connect: ['some_resource', 'some_resource'],
        'run-at': 'document-start',
        grant: ['grant1', 'grant2'],
        antifeature: 'antifeature',
        'antifeature:ru': 'antifeature:ru',
        noframes: null,
        unwrap: null,
        nocompat: null,
      };

      meta.validate(metaObj);

      expect(consoleLog).not.toHaveBeenCalled();
    });

    test('not allowed property', () => {
      const metaObj = {
        someInvalidProperty: 'some string',
        'name:jdj': 'name:jdj',
      };
      const msg1 = '\x1b[0mLooks you are trying to use unsupported meta property: someInvalidProperty\x1b[0m';
      const msg2 = '\x1b[0mLooks you are trying to use unsupported meta property: name:jdj\x1b[0m';

      meta.validate(metaObj);

      expect(consoleLog).toHaveBeenCalledTimes(3);
      expect(consoleLog).toHaveBeenNthCalledWith(1, msg1);
      expect(consoleLog).toHaveBeenNthCalledWith(2, msg2);
      expect(consoleLog).toHaveBeenLastCalledWith(visitMessage);
    });

    test('not allowed duplicate of properties', () => {
      const metaObj = {
        namespace: ['namespace', 'namespace'],
        version: ['version', 'version'],
        author: ['author', 'author'],
        homepage: 'https://homepage',
        homepageURL: 'https://homepageURL',
        website: 'https://website',
        source: 'https://source',
        icon: 'icon',
        iconURL: 'iconURL',
        defaulticon: 'defaulticon',
        icon64: 'icon64',
        icon64URL: 'icon64URL',
        updateURL: ['https://updateURL', 'https://updateURL'],
        downloadURL: ['https://downloadURL', 'https://downloadURL'],
        supportURL: ['https://supportURL', 'https://supportURL'],
        'run-at': ['document-start', 'document-body'],
        noframes: [null, null],
        unwrap: [null, null],
        nocompat: [null, null],
      };

      const msg1 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: namespace\x1b[0m';
      const msg2 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: version\x1b[0m';
      const msg3 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: author\x1b[0m';
      const msg5 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: homepageURL\x1b[0m';
      const msg6 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: website\x1b[0m';
      const msg7 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: source\x1b[0m';
      const msg9 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: iconURL\x1b[0m';
      const msg11 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: defaulticon\x1b[0m';
      const msg13 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: icon64URL\x1b[0m';
      const msg14 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: updateURL\x1b[0m';
      const msg15 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: downloadURL\x1b[0m';
      const msg16 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: supportURL\x1b[0m';
      const msg17 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: run-at\x1b[0m';
      const msg18 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: noframes\x1b[0m';
      const msg19 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: unwrap\x1b[0m';
      const msg20 = '\x1b[0mLooks like you are trying to use multiple meta property that should be single: nocompat\x1b[0m';

      meta.validate(metaObj);
      expect(consoleLog).toHaveBeenCalledTimes(17);
      expect(consoleLog).toHaveBeenNthCalledWith(1, msg1);
      expect(consoleLog).toHaveBeenNthCalledWith(2, msg2);
      expect(consoleLog).toHaveBeenNthCalledWith(3, msg3);
      expect(consoleLog).toHaveBeenNthCalledWith(4, msg5);
      expect(consoleLog).toHaveBeenNthCalledWith(5, msg6);
      expect(consoleLog).toHaveBeenNthCalledWith(6, msg7);
      expect(consoleLog).toHaveBeenNthCalledWith(7, msg9);
      expect(consoleLog).toHaveBeenNthCalledWith(8, msg11);
      expect(consoleLog).toHaveBeenNthCalledWith(9, msg13);
      expect(consoleLog).toHaveBeenNthCalledWith(10, msg14);
      expect(consoleLog).toHaveBeenNthCalledWith(11, msg15);
      expect(consoleLog).toHaveBeenNthCalledWith(12, msg16);
      expect(consoleLog).toHaveBeenNthCalledWith(13, msg17);
      expect(consoleLog).toHaveBeenNthCalledWith(14, msg18);
      expect(consoleLog).toHaveBeenNthCalledWith(15, msg19);
      expect(consoleLog).toHaveBeenNthCalledWith(16, msg20);
      expect(consoleLog).toHaveBeenLastCalledWith(visitMessage);
    });

    test('not valid values', () => {
      const metaObj = {
        homepage: 'gift+https://homepage.url',
        updateURL: 'httpd://updateURL.url',
        downloadURL: 'htt://downloadURL.url/#downloadURL',
        supportURL: 'gi+https://supportURL.url',
        include: 'http://include.url/#/',
        match: 'http://match.url/#',
        exclude: 'http://exclude.url#',
        'run-at': 'document-startr',
      };

      const msg1 = '\x1b[0mLooks like meta property: homepage have invalid value: gift+https://homepage.url\x1b[0m';
      const msg2 = '\x1b[0mLooks like meta property: updateURL have invalid value: httpd://updateURL.url\x1b[0m';
      const msg3 = '\x1b[0mLooks like meta property: downloadURL have invalid value: htt://downloadURL.url/#downloadURL\x1b[0m';
      const msg4 = '\x1b[0mLooks like meta property: supportURL have invalid value: gi+https://supportURL.url\x1b[0m';
      const msg5 = '\x1b[0mLooks like meta property: include have invalid value: http://include.url/#/\x1b[0m';
      const msg6 = '\x1b[0mLooks like meta property: match have invalid value: http://match.url/#\x1b[0m';
      const msg7 = '\x1b[0mLooks like meta property: exclude have invalid value: http://exclude.url#\x1b[0m';
      const msg8 = '\x1b[0mLooks like meta property: run-at have invalid value: document-startr\x1b[0m';
      const msg9 = '\x1b[0mupdateURL property requires version property as well.\x1b[0m';

      meta.validate(metaObj);

      expect(consoleLog).toHaveBeenCalledTimes(10);
      expect(consoleLog).toHaveBeenNthCalledWith(1, msg1);
      expect(consoleLog).toHaveBeenNthCalledWith(2, msg2);
      expect(consoleLog).toHaveBeenNthCalledWith(3, msg3);
      expect(consoleLog).toHaveBeenNthCalledWith(4, msg4);
      expect(consoleLog).toHaveBeenNthCalledWith(5, msg5);
      expect(consoleLog).toHaveBeenNthCalledWith(6, msg6);
      expect(consoleLog).toHaveBeenNthCalledWith(7, msg7);
      expect(consoleLog).toHaveBeenNthCalledWith(8, msg8);
      expect(consoleLog).toHaveBeenNthCalledWith(9, msg9);
      expect(consoleLog).toHaveBeenLastCalledWith(visitMessage);
    });
  });
});
