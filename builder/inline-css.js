'use strict';
const os = require('os');

function inlineCss(cssArray, addFilePathComments, onFileProgress) {
  let css = '';

  cssArray.forEach((element, index) => {
    index && (css += os.EOL);

    if (addFilePathComments) {
      css += `/* ${element.filePath} */${os.EOL}`;
    }

    css += element.file;
    onFileProgress(element.filePath);
  });

  return `

${ addFilePathComments ? '// CSS injection' + os.EOL : ''}(function(){
  const $style = document.createElement('style');

  $style.innerHTML = \`${css}\`;
  setTimeout(() =>{document.body.appendChild($style);}, 100);
})();`;
}

module.exports = inlineCss;
