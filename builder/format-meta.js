'use strict';

const os = require('os');

/**
 * Format meta from object
 * @param {Object} meta - meta object properties simple value or array
 * @returns {string}
 */
function formatMeta(meta) {
  let length = 0;
  let result = '';

  if (!meta) {
    return '';
  }

  for (let key of Object.keys(meta)) {
    length = key.length > length ? key.length : length;
  }

  result += '// ==UserScript==' + os.EOL;

  for (let [key, value] of Object.entries(meta)) {
    if (Array.isArray(value)) {
      value.forEach(val => result += `${formatCommentString(key, val, length)}${os.EOL}`);
    } else if (value !== '') {
      if (key === 'source') {
        value = value.replace(/^git\+http/, 'http');
      }

      result += `${formatCommentString(key, value, length)}${os.EOL}`;
    }
  }

  result += '// ==/UserScript==';

  return result;
}

/**
 * Return meta property string filled with whitespaces
 * @param {string} prop
 * @param {string} val
 * @param {number} length
 * @returns {string}
 */
function formatCommentString(prop, val, length) {
  if (prop.length < length) {
    const spacer = new Array(length - prop.length).fill(' ');
    prop += spacer.join('');
  }

  return `// @${prop}  ${val}`;
}

module.exports = formatMeta;
