const reset = '\x1b[0m';
const boldRed = '\x1b[1;31m';
const boldGreen = '\x1b[1;32m';
const boldYellow = '\x1b[1;33m';
const cyan = '\x1b[1;36m';

function error(msg) {
  console.log(`${boldRed}${msg}${reset}`);
}

function warning(msg) {
  console.log(`${boldYellow}${msg}${reset}`);
}

function success(msg) {
  console.log(`${boldGreen}${msg}${reset}`);
}

function note(msg) {
  console.log(`${cyan}${msg}${reset}`);
}

function info(msg) {
  console.log(`${reset}${msg}${reset}`);
}

function parameterDeprecated(oldParam, newParam) {
  warning(`--mode ${oldParam} parameter is deprecated and will will be deleted in upcoming major release. `
    + `Use --${newParam} instead.`);
}

function buildMessage(production, release) {
  const releaseMode = release ? `${release} ` : '';

  return `Build in ${releaseMode}${production ? 'production' : 'development'} mode.`;
}

/**
 * Messages on start build
 * @param {{
 * keepCodeComments: boolean,
 * patch: boolean,
 * minor: boolean,
 * major: boolean,
 * production: boolean,
 * keepFilePathComments: boolean,
 * noValidate: boolean
 * }} buildParams
 */
function startBuild(buildParams) {
  if (buildParams.major) {
    info(buildMessage(buildParams.production, 'release-major'));
  } else if (buildParams.minor) {
    info(buildMessage(buildParams.production, 'release-minor'));
  } else if (buildParams.patch) {
    info(buildMessage(buildParams.production, 'release-patch'));
  } else {
    info(buildMessage(buildParams.production));
  }

  if (buildParams.noValidate) {
    info('Meta validation messages will be muted.');
  }
}

function finishBuild(version) {
  if (version) {
    console.log(`New version: ${boldGreen}${version}${reset}`);
  }

  success('Build finished success');
}

function invalidMetaValue(name, value) {
  info(`Looks like meta property: ${name} have invalid value: ${value}`);
}

function invalidDuplicate(name) {
  info(`Looks like you are trying to use multiple meta property that should be single: ${name}`);
}

function invalidMetaProperty(name) {
  info(`Looks you are trying to use unsupported meta property: ${name}`);
}

function moreInfo() {
  info('Please visit https://www.tampermonkey.net/documentation.php?ext=dhdg for more details');
}

function updateURLRequiresVersion() {
  info('updateURL property requires version property as well.');
}

function packageJsonNotFound() {
  warning('package.json wasn\'t found. Default parameters will be used.');
  info('For details please see getting-started section in README.md');
}

module.exports = {
  error,
  warning,
  success,
  note,
  info,
  parameterDeprecated,
  startBuild,
  finishBuild,
  invalidMetaValue,
  invalidDuplicate,
  invalidMetaProperty,
  moreInfo,
  updateURLRequiresVersion,
  packageJsonNotFound,
};
