'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const minimist = require('minimist');

const inlineCss = require('./inline-css');
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
  fs.writeFileSync(outFileName, getOutFile());

  if (isRelease) {
    version.save(newversion);
    console.log(`Build finished 
Version: \x1b[36m${newversion}\x1b[0m`);
  } else {
    console.log('Build finished');
  }
}

function buildTree(filePath, parentPath) {
  // Get file name
  if (parentPath) {
    filePath = path.join(parentPath, '..', filePath);
  }

  if (visited.includes(filePath)) {
    return;
  }

  // Put file name into visited
  visited.push(filePath);

  // Open file
  const file = fs.readFileSync(filePath).toString();
  const importRegex = /^[\t\r ]*import.+['"];$/gm;
  const imports = [];

  // Get all imports
  let matches;

  while ((matches = importRegex.exec(file)) !== null) {
    imports.push(getImportPath(matches[0]));
  }

  imports.forEach(imrt => {
    buildTree(imrt, filePath);
  });

  if (/\.css$/g.test(filePath)) {
    css.push({ file, filePath: filePath.split('\\').join('/') });
  } else {
    files.push({
      file: file
        .split(importRegex)
        .join('')
        .split(/^export /gm) // TODO use one split
        .join('')
        .trim(),
      filePath: filePath.split('\\').join('/')
    });
  }
}

function getImportPath(_import) {
  return _import.split(/['"]/g)[1];
}

function getOutFile() {
  let out = getMeta();

  console.log('\x1b[33m%s\x1b[0m', 'Concat js files');

  files.forEach(file => {
    console.log(`${file.filePath.replace(/^\.\//g, '')}`);
    out += os.EOL + os.EOL;
    out += `// ${file.filePath}${os.EOL}`;
    out += file.file;
  });

  if (css.length) {
    console.log('\x1b[33m%s\x1b[0m', 'Concat css files');
    out += inlineCss(css, filePath => console.log(filePath));
  }

  return out;
}

module.exports = build;
