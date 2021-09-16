const os = require('os');

/**
 * Return meta property string filled with whitespaces
 * @param {string} property
 * @param {string} val
 * @param {number} length
 * @returns {string}
 */
function formatCommentString(property, val, length) {
  let prop = property;
  if (prop.length < length) {
    const spacer = new Array(length - prop.length).fill(' ');
    prop += spacer.join('');
  }

  return `// @${prop}  ${val}`;
}

/**
 * Format meta from object
 * @param {Object} meta - meta object properties simple value or array
 * @returns {string}
 */
function formatMeta(meta) {
  const result = ['// ==UserScript=='];
  let length = 0;

  if (!meta) {
    return '';
  }

  // Get the longest line
  Object.keys(meta).forEach((key) => {
    length = key.length > length ? key.length : length;
  });

  Object.entries(meta).forEach((keyValue) => {
    const key = keyValue[0];
    let value = keyValue[1];

    if (Array.isArray(value)) {
      value.forEach((val) => {
        result.push(formatCommentString(key, val, length));
      });
    } else if (value !== '') {
      if (key === 'source') {
        value = value.replace(/^git\+http/, 'http');
      }

      result.push(formatCommentString(key, value, length));
    }
  });

  result.push('// ==/UserScript==');

  return result.join(os.EOL);
}

module.exports = formatMeta;
