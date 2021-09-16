/**
 * Default builder configuration
 * @namespace
 * @property {string} entry    - Entry file path.
 * @property {string} dev      - Develop output folder path.
 * @property {string} release  - Release output folder path.
 * @property {string} fileName - Output file name part (will be updated with .user.js).
 */
const config = {
  entry: './src/index.js',
  dev: './dist',
  release: './release',
  fileName: 'new-userscript',
};

/**
 * Default user script meta information
 * @namespace
 * @property {string} name
 * @property {string} namespace
 * @property {string} version
 * @property {string} description
 * @property {string} author
 * @property {string} match
 * @property {string} grant
 */
const meta = {
  name: 'New Userscript',
  namespace: 'http://tampermonkey.net/',
  version: '0.0.0',
  description: 'try to take over the world!',
  author: 'You',
  match: 'http://*/*',
  grant: 'none',
};

module.exports = { config, meta };
