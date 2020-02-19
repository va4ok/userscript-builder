'use strict';
const os = require('os');

/**
 * Concat css files with file path comments or without if flag
 * @param {<string, string>[]} cssArray
 * @param {boolean} addFilePathComments
 * @param {function} onFileProcessed
 */
function concatCss(cssArray, addFilePathComments, onFileProcessed) {
  let css = '';

  cssArray.forEach((element, index) => {
    index && (css += os.EOL);

    if (addFilePathComments) {
      css += `/* ${element.filePath} */${os.EOL}`;
    }

    css += element.file;
    onFileProcessed(element.filePath);
  });

  return `

${addFilePathComments ? '// CSS injection' + os.EOL : ''}(function(){
  const $style = document.createElement('style');

  $style.innerHTML = \`${css}\`;
  document.body.appendChild($style);
})();`;
}


// TODO rename with get get inline css
module.exports = concatCss;
