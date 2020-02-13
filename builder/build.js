'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const minimist = require('minimist');

const inlineCss = require('./inline-css');
const fileHelper = require('./file-helper');
const getMeta = require('./get-meta');
const config = require('./config');
const version = require('./version');

const files = [];
const css = [];
const visited = [];

function build() {
  const argv = minimist(process.argv.slice(2));
  const newversion = version.increase(config.meta.version, argv['mode']);
  const isRelease = newversion !== config.meta.version;
  const outFolder = path.join(process.cwd(), isRelease ? config.release : config.dev);

  console.log(`Build in ${isRelease ? 'release-' : ''}${argv['mode']} mode`);

  if (!fs.existsSync(outFolder)) {
    fs.mkdirSync(outFolder);
  }

  const outFileName = path.join(outFolder, `${config.fileName}.user.js`);

  if (fs.existsSync(outFileName)) {
    fs.unlinkSync(outFileName);
  }

  config.meta.version = newversion;

  buildTree(config.entry);
  fs.writeFileSync(outFileName, getOutFile(!isRelease));

  if (isRelease) {
    version.save(newversion);
    console.log(`Build finished 
Version: \x1b[36m${newversion}\x1b[0m`);
  } else {
    console.log('Build finished');
  }
}

function getExistingFilePath(filePath, normalizedFilePath, parentPath) {
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  if (fs.existsSync(normalizedFilePath)) {
    return normalizedFilePath;
  }

  throw new Error(`${parentPath} tries to import unreachable file ${filePath}`);
}

function buildTree(filePath, parentPath) {
  // Get full file name
  if (parentPath) {
    filePath = path.join(parentPath, '..', filePath);
  }

  const normalizedFilePath = fileHelper.normalizeFileName(filePath);

  if (visited.includes(filePath) || visited.includes(normalizedFilePath)) {
    // file processed
    return;
  }

  filePath = getExistingFilePath(filePath, normalizedFilePath, parentPath);

  // Open file
  const importRegex = /^[\t\r ]*import.+['"];$/gm;
  const imports = [];
  const file = fs.readFileSync(filePath).toString();

  // Put file name into visited
  visited.push(filePath);

  // Get all imports
  let matches;

  while ((matches = importRegex.exec(file)) !== null) {
    imports.push(getImportPath(matches[0]));
  }

  imports.forEach(imrt => {
    buildTree(imrt, filePath);
  });

  if (/\.css$/g.test(filePath)) {
    css.push({file, filePath: filePath.split('\\').join('/')});
  } else {
    files.push({
      file: file
        .split(importRegex)
        .join('')
        .split(/^(?:export default )|(?:export )/gm) // TODO use one split
        .join('')
        .trim(),
      filePath: filePath.split('\\').join('/')
    });
  }
}

function getImportPath(_import) {
  return _import.split(/['"]/g)[1];
}

function getOutFile(addFilePathComments) {
  let out = getMeta();

  console.log('\x1b[33m%s\x1b[0m', 'Concat js files');

  files.forEach(file => {
    const filePath = file.filePath.replace(/^\.\//g, '');

    console.log(`${filePath}`);
    out += os.EOL + os.EOL;

    if (addFilePathComments) {
      out += `// ${filePath}${os.EOL}`;
    }

    out += file.file;
  });

  if (css.length) {
    console.log('\x1b[33m%s\x1b[0m', 'Concat css files');
    out += inlineCss(css, addFilePathComments, filePath => console.log(filePath));
  }

  return out;
}

module.exports = build;
