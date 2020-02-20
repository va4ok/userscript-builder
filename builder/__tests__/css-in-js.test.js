'use strict';
const cssInJs = require('../css-in-js');
const os = require('os');

describe('css files concat', () => {
  test('do not remove start comment', () => {
    const input = `.style-rule{ padding: 0; }`;

    const output = `// CSS injection${os.EOL}(function(){
  const $style = document.createElement('style');

  $style.innerHTML = \`.style-rule{ padding: 0; }\`;
  document.body.appendChild($style);
})();`;

    expect(cssInJs(input, true)).toBe(output);
  });

  test('remove start comment', () => {
    const input = `.style-rule{ padding: 0; }`;

    const output = `(function(){
  const $style = document.createElement('style');

  $style.innerHTML = \`.style-rule{ padding: 0; }\`;
  document.body.appendChild($style);
})();`;

    expect(cssInJs(input, false)).toBe(output);
  });
});