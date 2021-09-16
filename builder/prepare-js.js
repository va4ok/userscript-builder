/**
 * Removes from text 'import', 'export', 'export default' statements.
 * Removes from text single and multi line comments if flag given.
 * @param {string} file
 * @param {boolean} isRemoveComments
 * @returns {string}
 */
function prepareJs(file, isRemoveComments = false) {
  const regexps = [
    '^[\\t\\r ]*import.+[\'"];$', // imports
    '^export +(?:default +)*', // exports
  ];

  if (isRemoveComments) {
    regexps.push(' *\\/\\*[\\s\\S]*?\\*\\/ *\\r?\\n'); // Multiline comments
    regexps.push('^ *\\/\\/[\\s\\S]*?$\\r?\\n'); // Single line comments full line
    regexps.push(' *\\/\\/[\\s\\S]*?$'); // Single line comments not full line
  }

  return file.split(new RegExp(regexps.join('|'), 'gm')).join('').trim();
}

module.exports = prepareJs;
