/**
 * Return position in version according build mode
 * @param {'bug' | 'bugfix' | 'min' | 'minor' | 'maj' | 'major' | *} buildMode
 * @returns {number}
 */
function getPositionByBuildMode(buildMode) {
  switch (buildMode.toLowerCase()) {
    case 'major':
    case 'maj':
      return 0;
    case 'minor':
    case 'min':
      return 1;
    case 'bugfix':
    case 'bug':
      return 2;
    default:
      return -1;
  }
}

/**
 * Increase 3 number version according build mode
 * @param {string} version
 * @param {'bug' | 'bugfix' | 'min' | 'minor' | 'maj' | 'major' | *} buildMode
 * @returns {string}
 */
function increase(version, buildMode) {
  const position = getPositionByBuildMode(buildMode);

  if (position === -1) {
    return version;
  }

  return version
    .split('.')
    .map((value, index) => {
      let result = parseInt(value, 10);

      if (index === position) {
        result += 1;
      } else if (index > position) {
        result = 0;
      }

      return result;
    })
    .join('.');
}

module.exports = increase;
