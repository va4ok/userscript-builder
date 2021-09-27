/**
 * Return position in version according build mode
 * @param {{ patch: boolean, minor: boolean, major: boolean }} buildMode
 * @returns {number}
 */
function getPositionByBuildMode(buildMode) {
  if (buildMode.major) return 0;
  if (buildMode.minor) return 1;
  if (buildMode.patch) return 2;

  return -1;
}

/**
 * Increase 3 number version according to build mode
 * @param {string} version
 * @param {{ patch: boolean, minor: boolean, major: boolean }} buildMode
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
