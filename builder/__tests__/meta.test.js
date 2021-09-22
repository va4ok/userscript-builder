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
    const visitMessage = 'Please visit https://www.tampermonkey.net/documentation.php?ext=dhdg for more details';

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
      const msg1 = 'Looks you are trying to use unsupported meta property: someInvalidProperty';
      const msg2 = 'Looks you are trying to use unsupported meta property: name:jdj';

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

      const msg1 = 'Looks like you are trying to use multiple meta property that should be single: namespace';
      const msg2 = 'Looks like you are trying to use multiple meta property that should be single: version';
      const msg3 = 'Looks like you are trying to use multiple meta property that should be single: author';
      const msg5 = 'Looks like you are trying to use multiple meta property that should be single: homepageURL';
      const msg6 = 'Looks like you are trying to use multiple meta property that should be single: website';
      const msg7 = 'Looks like you are trying to use multiple meta property that should be single: source';
      const msg9 = 'Looks like you are trying to use multiple meta property that should be single: iconURL';
      const msg11 = 'Looks like you are trying to use multiple meta property that should be single: defaulticon';
      const msg13 = 'Looks like you are trying to use multiple meta property that should be single: icon64URL';
      const msg14 = 'Looks like you are trying to use multiple meta property that should be single: updateURL';
      const msg15 = 'Looks like you are trying to use multiple meta property that should be single: downloadURL';
      const msg16 = 'Looks like you are trying to use multiple meta property that should be single: supportURL';
      const msg17 = 'Looks like you are trying to use multiple meta property that should be single: run-at';
      const msg18 = 'Looks like you are trying to use multiple meta property that should be single: noframes';
      const msg19 = 'Looks like you are trying to use multiple meta property that should be single: unwrap';
      const msg20 = 'Looks like you are trying to use multiple meta property that should be single: nocompat';

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

      const msg1 = 'Looks like meta property: homepage have invalid value: gift+https://homepage.url';
      const msg2 = 'Looks like meta property: updateURL have invalid value: httpd://updateURL.url';
      const msg3 = 'Looks like meta property: downloadURL have invalid value: htt://downloadURL.url/#downloadURL';
      const msg4 = 'Looks like meta property: supportURL have invalid value: gi+https://supportURL.url';
      const msg5 = 'Looks like meta property: include have invalid value: http://include.url/#/';
      const msg6 = 'Looks like meta property: match have invalid value: http://match.url/#';
      const msg7 = 'Looks like meta property: exclude have invalid value: http://exclude.url#';
      const msg8 = 'Looks like meta property: run-at have invalid value: document-startr';
      const msg9 = 'updateURL property requires version property as well.';

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
