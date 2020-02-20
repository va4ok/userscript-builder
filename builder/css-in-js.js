'use strict';
const os = require('os');

/**
 * Return CSS code injected into JS
 * @param {string} css              - prepared css text
 * @param {boolean} addStartComment - add '// CSS injection' before function declaration if true
 */
function cssInJs(css, addStartComment) {
  return `${addStartComment ? '// CSS injection' + os.EOL : ''}(function(){
  const $style = document.createElement('style');

  $style.innerHTML = \`${css}\`;
  document.body.appendChild($style);
})();`;
}

module.exports = cssInJs;
