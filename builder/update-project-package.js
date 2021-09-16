const fs = require('fs');
const path = require('path');

/**
 * Update package.json with specified object
 * @param obj
 */
function update(obj) {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const packageJson = require(packageJsonPath);

    fs.writeFileSync(packageJsonPath, JSON.stringify({ ...packageJson, ...obj }, null, 2));
    // eslint-disable-next-line no-empty
  } catch (e) {
  }
}

module.exports = update;
