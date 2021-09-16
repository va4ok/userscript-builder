const os = require('os');

/**
 * Return CSS code injected into JS
 * @param {string} css              - prepared css text
 * @param {boolean} addStartComment - if add '// CSS injection' comment before function declaration
 */
function cssInJs(css, addStartComment) {
  return `${addStartComment ? `// CSS injection${os.EOL}` : ''}(function(){
  const $style = document.createElement('style');

  $style.innerHTML = \`${css}\`;

  if (document.readyState === 'complete' ||
      document.readyState === 'interactive') {
    document.body.appendChild($style);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild($style);
    });
  }
})();`;
}

module.exports = cssInJs;
