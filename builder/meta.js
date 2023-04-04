const os = require('os');
const report = require('./report');

class MetaValidationRule {
  constructor(namePattern, valuePattern, isMultiple) {
    this.namePattern = `^${namePattern}$`;
    this.valuePattern = valuePattern ? `^${valuePattern}$` : null;
    this.isMultile = isMultiple;
    this.visited = false;
  }

  /**
   * Return if value is valid
   * @param {string} value
   * @returns {boolean}
   */
  validateValue(value) {
    if (this.valuePattern) {
      if (!(new RegExp(this.valuePattern).exec(value))) {
        return false;
      }
    }

    return true;
  }

  /**
   * Return true if name valid
   * @param {string} name
   */
  validateName(name) {
    return new RegExp(this.namePattern).test(name);
  }

  /**
   * If rule visited
   * @returns {boolean}
   */
  getVisited() {
    return this.visited;
  }

  /**
   * Set is visible to true for not multiple values
   */
  setVisited() {
    this.visited = !this.isMultile;
  }
}

/**
 * Create set of rules
 * @returns {MetaValidationRule[]}
 */
function createRules() {
  return [
    new MetaValidationRule('name(:[a-z]{2})?', '', true),
    new MetaValidationRule('namespace'),
    new MetaValidationRule('version'),
    new MetaValidationRule('author'),
    new MetaValidationRule('description(:[a-z]{2})?', '', true),
    new MetaValidationRule('(homepage|homepageURL|website|source)', '(git\\+)?https?://.+'),
    new MetaValidationRule('(icon|iconURL|defaulticon)'),
    new MetaValidationRule('(icon64|icon64URL)'),
    new MetaValidationRule('updateURL', 'https?://.+'),
    new MetaValidationRule('downloadURL', '(none)|(https?://.+)'),
    new MetaValidationRule('supportURL', '(git\\+)?https?://.+'),
    new MetaValidationRule('include', '[^#]*', true),
    new MetaValidationRule('match', '[^#]*', true),
    new MetaValidationRule('exclude', '[^#]*', true),
    new MetaValidationRule('require', '', true),
    new MetaValidationRule('resource', '', true),
    new MetaValidationRule('connect', '', true),
    new MetaValidationRule('run-at', '(document-start|document-body|document-end|document-idle|context-menu)'),
    new MetaValidationRule('grant', '', true),
    new MetaValidationRule('antifeature(:[a-z]{2})?', '', true),
    new MetaValidationRule('noframes'),
    new MetaValidationRule('unwrap'),
    new MetaValidationRule('nocompat'),
  ];
}

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

function validateProperty(name, value, rules) {
  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];
    // TODO optimize regexp creation
    if (rule.validateName(name)) {
      let result = true;

      if (!rule.validateValue(value)) {
        report.invalidMetaValue(name, value);
        result = false;
      }

      if (rule.getVisited()) {
        report.invalidDuplicate(name);
        result = false;
      }

      rule.setVisited();
      return result;
    }
  }

  report.invalidMetaProperty(name);

  return false;
}

/**
 * Validate meta info
 * @param {Object} meta - meta to validate
 */
function validate(meta) {
  if (!meta) {
    return;
  }

  const rules = createRules();

  let hasInvalid = false;

  Object.entries(meta).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => {
        hasInvalid = !validateProperty(key, val, rules) || hasInvalid;
      });
    } else {
      hasInvalid = !validateProperty(key, value, rules) || hasInvalid;
    }
  });

  if (meta.updateURL && !meta.version) {
    report.updateURLRequiresVersion();
    hasInvalid = true;
  }

  if (hasInvalid) {
    report.moreInfo();
  }
}

/**
 * Format meta from object
 * @param {Object} meta - meta object properties simple value or array
 * @returns {string}
 */
function format(meta) {
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

// TODO refactor meta.collect
module.exports = {
  format,
  validate,
};
