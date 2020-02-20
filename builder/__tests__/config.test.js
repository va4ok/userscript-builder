'use strict';

// jest.mock('fs');
// const fs = require('fs');
const path = require('path');

// fs.__setMockFiles('');

const config = require('../config');

xdescribe('config', () => {
  test('no meta i', () => {
    const config = require('../config');
    expect(config).toBe('');
  });
});
