const os = require('os');

/**
 * Concatenate css files with file path comments or without if flag
 * @param {{filePath: string, file:string}[]} cssArray
 * @param {boolean} addFilePathComments
 * @param {function} onFileProcessed
 */
function concatCss(cssArray, addFilePathComments, onFileProcessed = () => {
}) {
  let css = '';

  cssArray.forEach((element, index) => {
    if (index) {
      css += os.EOL;
    }

    if (addFilePathComments) {
      css += `/* ${element.filePath} */${os.EOL}`;
    }

    const safeCss = element.file.replace(/\\([a-f]|[A-F]|[0-9]){2,4}/g, '\\$&');

    css += safeCss;
    onFileProcessed(element.filePath);
  });

  return css;
}

module.exports = concatCss;
