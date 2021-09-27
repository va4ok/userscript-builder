const minimist = require('minimist');

function parameterDeprecatedMessage(oldParam, newParam) {
  console.log(`--mode ${oldParam} parameter is deprecated and will will be deleted in upcoming major release. `
    + `Use --${newParam} instead.`);
}

function validate(processArguments) {
  if (processArguments.includes('--mode')) {
    if (processArguments.includes('dev')) {
      parameterDeprecatedMessage('dev', 'development');
    }

    if (processArguments.includes('bug')) {
      parameterDeprecatedMessage('bug', 'release-patch');
    }

    if (processArguments.includes('bugfix')) {
      parameterDeprecatedMessage('bugfix', 'release-patch');
    }

    if (processArguments.includes('min')) {
      parameterDeprecatedMessage('min', 'release-minor');
    }

    if (processArguments.includes('minor')) {
      parameterDeprecatedMessage('minor', 'release-minor');
    }

    if (processArguments.includes('maj')) {
      parameterDeprecatedMessage('maj', 'release-major');
    }

    if (processArguments.includes('major')) {
      parameterDeprecatedMessage('major', 'release-major');
    }
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
  const argv = minimist(processArguments.slice(2));
  const noValidate = argv.validate === false;
  // processArguments.includes('--no-validate');

  let production = !argv.development && !argv.dev && argv.mode !== 'dev' && argv.mode !== 'development';
  // !processArguments.includes('--dev') && !processArguments.includes('--development');
  let patch = processArguments.includes('--release-patch');
  let minor = processArguments.includes('--release-minor');
  let major = processArguments.includes('--release-major');

  // Old api
  // TODO refactor - remove in new api
  if (processArguments.includes('--mode')) {
    production = !processArguments.includes('dev');
    patch = argv.mode === 'bug' || argv.mode === 'bugfix';
    // processArguments.includes('bug') || processArguments.includes('bugfix');
    minor = argv.mode === 'min' || argv.mode === 'minor';
    // processArguments.includes('min') || processArguments.includes('minor');
    major = argv.mode === 'maj' || argv.mode === 'major';
    // processArguments.includes('maj') || processArguments.includes('major');
  }

  const keepFilePathComments = !production;
  const keepCodeComments = !production;

  return {
    noValidate,
    production,
    keepCodeComments,
    keepFilePathComments,
    patch,
    minor,
    major,
  };
}

module.exports = {
  parse,
  validate,
};
