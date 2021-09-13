'use strict';
const fs = require('fs');
const path = require('path');

const minimist = require('minimist');

const prepareJs = require('./prepare-js');
const fileName = require('./file-name');
const increaseVersion = require('./increase-version');
const updatePackageJson = require('./update-project-package');
const utils = require('./utils');

const files = {
  js: [],
  css: [],
  visited: []
};

function buildTree(filePath, parentPath) {
  // Get full file name
  if (parentPath) {
    filePath = path.join(parentPath, '..', filePath);
  }

  const normalizedFilePath = fileName.normalizeFileName(filePath);

  if (isFileProcessed(filePath, normalizedFilePath)) {
    return;
  }

  filePath = utils.getExistingFilePath(filePath, normalizedFilePath, parentPath);

  const file = fs.readFileSync(filePath).toString();
  // Mark file as processed
  files.visited.push(filePath);
  utils.getImports(file).forEach(imprt => buildTree(imprt, filePath));

  if (/\.css$/g.test(filePath)) {
    files.css.push({file, filePath: fileName.revertSlashes(filePath)});
  } else {
    files.js.push({file: prepareJs(file), filePath: fileName.revertSlashes(filePath)});
  }
}

function isFileProcessed(filePath, normalizedFilePath) {
  return files.visited.includes(filePath) || files.visited.includes(normalizedFilePath);
}

function build() {
  const argv = minimist(process.argv.slice(2));
  const config = utils.getConfig();
  const newversion = increaseVersion(config.meta.version, argv['mode']);
  const isRelease = newversion !== config.meta.version;

  utils.startBuildReport(isRelease, argv['mode']);

  config.meta.version = newversion;
  buildTree(config.entry);
  fs.writeFileSync(
    utils.createFolderAndFile(isRelease, config),
    utils.concatFiles(!isRelease, files, config.meta)
  );

  if (isRelease) {
    updatePackageJson({version: newversion});
  }

  utils.finishBuildReport(isRelease ? newversion : null);
}

module.exports = build;
