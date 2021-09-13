const path = require('path');
const fs = require('fs');
const os = require('os');

const formatMeta = require('./format-meta');
const concatCss = require('./concat-css');
const cssInJs = require('./css-in-js');
const prepareConfig = require('./prepare-config');

function getConfig() {
  let packageJson;

  try {
    packageJson = require(path.join(process.cwd(), 'package.json'));
  } catch (e) {
    console.warn("package.json wasn't found. Default parameters will be used.");
    console.error(e);
  }

  return prepareConfig(packageJson);
}

function createFolderAndFile(isRelease, config) {
  const outFolder = path.join(
    process.cwd(),
    isRelease ? config.release : config.dev
  );
  const outFileName = path.join(outFolder, `${config.fileName}.user.js`);

  if (!fs.existsSync(outFolder)) {
    fs.mkdirSync(outFolder);
  }

  if (fs.existsSync(outFileName)) {
    fs.unlinkSync(outFileName);
  }

  return outFileName;
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

function getImportPath(imprt) {
  return imprt.split(/['"]/g)[1];
}

function getImports(file) {
  const importRegex = /^[\t\r ]*import.+['"];$/gm;
  const imports = [];
  let matches;

  while ((matches = importRegex.exec(file)) !== null) {
    imports.push(getImportPath(matches[0]));
  }

  return imports;
}

function concatFiles(addFilePathComments, files, configMeta) {
  let out = formatMeta(configMeta);

  console.log('\x1b[33m%s\x1b[0m', 'Concat js files');

  files.js.forEach((file) => {
    const filePath = file.filePath.replace(/^\.\//g, '');

    console.log(`${filePath}`);
    out += os.EOL + os.EOL;

    if (addFilePathComments) {
      out += `// ${filePath}${os.EOL}`;
    }

    out += file.file;
  });

  if (files.css.length) {
    console.log('\x1b[33m%s\x1b[0m', 'Concat css files');
    const concatenatedCss = concatCss(
      files.css,
      addFilePathComments,
      (filePath) => console.log(filePath)
    );
    out += `${os.EOL}${os.EOL}${cssInJs(concatenatedCss, addFilePathComments)}`;
  }

  return out;
}

function startBuildReport(isRelease, mode) {
  console.log(`Build in ${isRelease ? 'release-' : ''}${mode} mode`);
}

function finishBuildReport(version) {
  let message = ['Build finished'];

  if (version) {
    message.push(`Version: \x1b[36m${version}\x1b[0m`);
  }

  console.log(message.join(os.EOL));
}

module.exports = {
  getConfig,
  createFolderAndFile,
  getExistingFilePath,
  getImports,
  concatFiles,
  startBuildReport,
  finishBuildReport,
};
