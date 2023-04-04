const report = require('./report');

/**
 * Transform process arguments array into object with boolean and string values.
 * @param {string[]} processArguments
 * @returns
 */
function mapParams(processArguments = []) {
  const args = {};

  processArguments.forEach((arg, index, array) => {
    if (arg.includes('--')) {
      const nextArg = array[index + 1];
      const key = arg
        .replace('--', '')
        .split('-')
        .reduce((prev, next) => prev + next.charAt(0).toUpperCase() + next.slice(1));

      if (nextArg && !nextArg.includes('--')) {
        args[key] = nextArg;
      } else {
        args[key] = true;
      }
    }
  });

  return args;
}

/**
 * Notify if old api uses
 * @param {*} argv
 * @todo remove on major release
 */
function validate(argv) {
  if (argv.mode === 'dev') {
    report.parameterDeprecated('dev', 'development');
  }

  if (argv.mode === 'bug') {
    report.parameterDeprecated('bug', 'release-patch');
  }

  if (argv.mode === 'bugfix') {
    report.parameterDeprecated('bugfix', 'release-patch');
  }

  if (argv.mode === 'min') {
    report.parameterDeprecated('min', 'release-minor');
  }

  if (argv.mode === 'minor') {
    report.parameterDeprecated('minor', 'release-minor');
  }

  if (argv.mode === 'maj') {
    report.parameterDeprecated('maj', 'release-major');
  }

  if (argv.mode === 'major') {
    report.parameterDeprecated('major', 'release-major');
  }
}

/**
 * Parse process argv and return build params
 * @param processArguments
 * @returns {{
 * keepCodeComments: boolean,
 * patch: boolean,
 * minor: boolean,
 * major: boolean,
 * production: boolean,
 * keepFilePathComments: boolean,
 * noValidate: boolean
 * }}
 */
function parse(processArguments = []) {
  const argv = mapParams(processArguments);

  // TODO remove on new api - major release
  validate(argv);

  let production = !argv.development && !argv.dev && argv.mode !== 'dev' && argv.mode !== 'development';
  let patch = !!argv.releasePatch;
  let minor = !!argv.releaseMinor;
  let major = !!argv.releaseMajor;

  // Old api
  // TODO refactor - remove in new api
  if (argv.mode) {
    production = !processArguments.includes('dev');
    patch = argv.mode === 'bug' || argv.mode === 'bugfix';
    minor = argv.mode === 'min' || argv.mode === 'minor';
    major = argv.mode === 'maj' || argv.mode === 'major';
  }

  const keepFilePathComments = !production;
  const keepCodeComments = !production;

  return {
    noValidate: !!argv.noValidate,
    production,
    keepCodeComments,
    keepFilePathComments,
    patch,
    minor,
    major,
  };
}

module.exports = {
  map: mapParams,
  parse,
  validate,
};
