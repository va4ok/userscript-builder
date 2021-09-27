const fs = require('fs');

const minimist = require('minimist');
const meta = require('./meta');

const increaseVersion = require('./increase-version');
const updatePackageJson = require('./update-project-package');
const utils = require('./utils');

function build() {
  const args = process.argv.slice(2);
  const argv = minimist(args);
  const config = utils.getConfig();
  const newversion = increaseVersion(config.meta.version, argv.mode);
  const production = !argv.development && !argv.dev && argv.mode !== 'dev' && argv.mode !== 'development';
  const noValidate = argv.validate === false;
  const isRelease = newversion !== config.meta.version;
  const files = {
    js: [],
    css: [],
    visited: [],
  };

  utils.startBuildReport(isRelease, argv.mode);

  config.meta.version = newversion;
  utils.buildTree(config.entry, null, files);

  if (!noValidate) {
    meta.validate(config.meta);
  }

  fs.writeFileSync(
    utils.createFolderAndFile(production, config),
    utils.concatFiles(!production, files, config.meta),
  );

  if (isRelease) {
    updatePackageJson({ version: newversion });
  }

  utils.finishBuildReport(isRelease ? newversion : null);
}

module.exports = build;
