/**
 * Allowed extensions
 * @type {string[]}
 */
const extensions = [
  'js',
  'css',
];

/**
 * Check if filename contains selected extension
 * @param {string} filename
 * @param {string} ext
 * @returns {boolean}
 */
function isContainsExtension(filename, ext) {
  // we need check if extension with dot are last characters in filename
  // not sure if it is a good solution but it doesn't create any regexp
  const dotExt = `.${ext}`;
  const extLength = dotExt.length;
  const offset = filename.length - extLength;

  return filename.indexOf(dotExt, offset) !== -1;
}

/**
 * Check if file contains any extension from list
 * @param {string} filename
 * @param {string[]} extensionList
 * @returns {boolean}
 */
function isContainsExtensionFromList(filename, extensionList) {
  const filenameLowCase = filename.toLowerCase();
  let result = false;

  extensionList.forEach((ext) => {
    // if result true - we already found extension
    if (!result) {
      result = isContainsExtension(filenameLowCase, ext);
    }
  });

  return result;
}

/**
 * Return file name with allowed extension (js or css)
 * @param {string} filePath
 * @returns {string}
 */
function normalizeFileName(filePath) {
  if (isContainsExtensionFromList(filePath, extensions)) {
    return filePath;
  }

  return `${filePath}.js`;
}

/**
 * Replace \ symbols with /
 * @param {string} filePath
 * @returns {string}
 */
function revertSlashes(filePath) {
  return filePath.split('\\').join('/');
}

module.exports = { normalizeFileName, revertSlashes };
