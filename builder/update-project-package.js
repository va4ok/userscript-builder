'use strict';
const fs = require('fs');
const path = require('path');

function update(obj) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = require(packageJsonPath);

  fs.writeFileSync(packageJsonPath, JSON.stringify({...packageJson, ...obj}, null, 2));
}

module.exports = update;
