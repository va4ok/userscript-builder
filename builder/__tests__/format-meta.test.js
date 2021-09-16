/* eslint-env node, jest */

const os = require('os');
const formatMeta = require('../format-meta');

describe('format meta', () => {
  test('no meta', () => {
    expect(formatMeta()).toBe('');
  });

  test('emty meta', () => {
    const meta = {};
    const formattedMeta = `// ==UserScript==${os.EOL
    }// ==/UserScript==`;

    expect(formatMeta(meta)).toBe(formattedMeta);
  });

  test('single values', () => {
    const meta = {
      name: 'name',
      some: 'more meta filed',
    };
    const formattedMeta = `// ==UserScript==${os.EOL
    }// @name  name${os.EOL
    }// @some  more meta filed${os.EOL
    }// ==/UserScript==`;

    expect(formatMeta(meta)).toBe(formattedMeta);
  });

  test('multiple values', () => {
    const meta = {
      name: 'name',
      some: ['more', 'meta', 'filed'],
    };
    const formattedMeta = `// ==UserScript==${os.EOL
    }// @name  name${os.EOL
    }// @some  more${os.EOL
    }// @some  meta${os.EOL
    }// @some  filed${os.EOL
    }// ==/UserScript==`;

    expect(formatMeta(meta)).toBe(formattedMeta);
  });

  test('all values should be aligned with at least 2 whitespaces', () => {
    const meta = {
      s: 's',
      veryVeryLongField: 'veryVeryLongField',
    };
    const formattedMeta = `// ==UserScript==${os.EOL
    }// @s                  s${os.EOL
    }// @veryVeryLongField  veryVeryLongField${os.EOL
    }// ==/UserScript==`;

    expect(formatMeta(meta)).toBe(formattedMeta);
  });

  test('remove from source field "git+" value', () => {
    const meta = {
      source: 'git+https://some.url',
      source2: 'git+https://some.url',
    };
    const formattedMeta = `// ==UserScript==${os.EOL
    }// @source   https://some.url${os.EOL
    }// @source2  git+https://some.url${os.EOL
    }// ==/UserScript==`;

    expect(formatMeta(meta)).toBe(formattedMeta);
  });

  test('do not add empty values', () => {
    const meta = {
      empty: '',
      notEmpty: 'some value',
    };
    const formattedMeta = `// ==UserScript==${os.EOL
    }// @notEmpty  some value${os.EOL
    }// ==/UserScript==`;

    expect(formatMeta(meta)).toBe(formattedMeta);
  });
});
