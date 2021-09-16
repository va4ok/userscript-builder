const fs = require('fs');

const minimist = require('minimist');

const increaseVersion = require('./increase-version');
const updatePackageJson = require('./update-project-package');
const utils = require('./utils');

function build() {
  const argv = minimist(process.argv.slice(2));
  const config = utils.getConfig();
  const newversion = increaseVersion(config.meta.version, argv.mode);
  const isRelease = newversion !== config.meta.version;
  const files = {
    js: [],
    css: [],
    visited: [],
  };

  utils.startBuildReport(isRelease, argv.mode);

  config.meta.version = newversion;
  utils.buildTree(config.entry, null, files);
  fs.writeFileSync(
    utils.createFolderAndFile(isRelease, config),
    utils.concatFiles(!isRelease, files, config.meta),
  );

  if (isRelease) {
    updatePackageJson({ version: newversion });
  }

  utils.finishBuildReport(isRelease ? newversion : null);
}

module.exports = build;
