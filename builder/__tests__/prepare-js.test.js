/* eslint-env node, jest */

const prepareJs = require('../prepare-js');

describe('Prepare js code', () => {
  test('remove import keyword', () => {
    const input = `import { Notificator } from "./notificator/notificator.js";
import SayHello from './say-hello/say-hello';

class EmptyClass{}`;

    const output = 'class EmptyClass{}';

    expect(prepareJs(input)).toBe(output);
  });

  test('remove export keyword', () => {
    const input = `import { Notificator } from "./notificator/notificator.js";
import SayHello from './say-hello/say-hello';

export class EmptyClass{}`;

    const output = 'class EmptyClass{}';

    expect(prepareJs(input)).toBe(output);
  });

  test('remove export default keywords', () => {
    const input = `import { Notificator } from "./notificator/notificator.js";
import SayHello from './say-hello/say-hello';

export default class EmptyClass{}`;

    const output = 'class EmptyClass{}';

    expect(prepareJs(input)).toBe(output);
  });

  test('keep single line comments', () => {
    const input = `import { Notificator } from "./notificator/notificator.js";
import SayHello from './say-hello/say-hello';

// Single line comment
export default class EmptyClass{// One more single line comment
}`;

    const output = `// Single line comment
class EmptyClass{// One more single line comment
}`;

    expect(prepareJs(input)).toBe(output);
  });

  test('remove single line comments', () => {
    const input = `import { Notificator } from "./notificator/notificator.js";
import SayHello from './say-hello/say-hello';

// Single line comment
export default class EmptyClass{// One more single line comment
}`;

    const output = `class EmptyClass{
}`;

    expect(prepareJs(input, true)).toBe(output);
  });

  test('keep multi line comments', () => {
    const input = `import { Notificator } from "./notificator/notificator.js";
import SayHello from './say-hello/say-hello';

/*
 Some
multi
line
comment
*/
export default class EmptyClass{
}`;

    const output = `/*
 Some
multi
line
comment
*/
class EmptyClass{
}`;

    expect(prepareJs(input)).toBe(output);
  });

  test('remove multi line comments', () => {
    const input = `import { Notificator } from "./notificator/notificator.js";
import SayHello from './say-hello/say-hello';

/*
 Some
multi
line
comment
*/
export default class EmptyClass{
}`;

    const output = `class EmptyClass{
}`;

    expect(prepareJs(input, true)).toBe(output);
  });
});
