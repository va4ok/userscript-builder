const concatCss = require('../concat-css');

describe('css files concat', () => {
  test('do not remove comments', () => {
    const input = '';
    const output = '';
    expect(concatCss(input)).toBe(output);
  });
});
