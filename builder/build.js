const fs = require('fs');

const meta = require('./meta');
const utils = require('./utils');
const args = require('./args');
const report = require('./report');

const increaseVersion = require('./increase-version');
const updatePackageJson = require('./update-project-package');

function build() {
  const buildParams = args.parse(process.argv.slice(2));
  const config = utils.getConfig();
  const isRelease = buildParams.major || buildParams.minor || buildParams.patch;
  const version = {
    new: increaseVersion(config.meta.version, buildParams),
    old: config.meta.version,
  };
  const files = {
    js: [],
    css: [],
    visited: [],
  };

  report.startBuild(buildParams);

  config.meta.version = version.new;
  utils.buildTree(config.entry, null, files);

  if (!buildParams.noValidate) {
    meta.validate(config.meta);
  }

  fs.writeFileSync(
    utils.createFolderAndFile(buildParams.production, config),
    utils.concatFiles(!buildParams.production, files, config.meta),
  );

  if (isRelease) {
    updatePackageJson({ version: version.new });
  }

  report.finishBuild(isRelease ? version.new : null);
}

module.exports = build;
