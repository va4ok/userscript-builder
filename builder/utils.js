const path = require('path');
const fs = require('fs');
const os = require('os');

const meta = require('./meta');
const concatCss = require('./concat-css');
const cssInJs = require('./css-in-js');
const prepareConfig = require('./prepare-config');
const fileName = require('./file-name');
const prepareJs = require('./prepare-js');
const report = require('./report');

function getConfig() {
  let packageJson;

  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    packageJson = require(path.join(process.cwd(), 'package.json'));
  } catch (e) {
    report.packageJsonNotFound();
  }

  return prepareConfig(packageJson);
}

function createFolderAndFile(isRelease, config) {
  const outFolder = path.join(
    process.cwd(),
    isRelease ? config.release : config.dev,
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

  let errorMessage;

  if (parentPath) {
    errorMessage = `${parentPath} tries to import unreachable file ${filePath}`;
  } else {
    errorMessage = `Can not reach root script file: ${path.join(process.cwd(), filePath)}`;
  }

  report.error(errorMessage);
  throw new Error('Unreachable file');
}

function getImportPath(imprt) {
  return imprt.split(/['"]/g)[1];
}

function getImports(file) {
  const importRegex = /^[\t\r ]*import.+['"];$/gm;
  const imports = [];
  let matches;

  // eslint-disable-next-line no-cond-assign
  while ((matches = importRegex.exec(file)) !== null) {
    imports.push(getImportPath(matches[0]));
  }

  return imports;
}

function concatFiles(addFilePathComments, files, configMeta) {
  let out = meta.format(configMeta);

  report.note('Concat js files');

  files.js.forEach((file) => {
    const filePath = file.filePath.replace(/^\.\//g, '');

    report.info(`${filePath}`);
    out += os.EOL + os.EOL;

    if (addFilePathComments) {
      out += `// ${filePath}${os.EOL}`;
    }

    out += file.file;
  });

  if (files.css.length) {
    report.note('Concat css files');
    const concatenatedCss = concatCss(
      files.css,
      addFilePathComments,
      (filePath) => report.info(filePath),
    );
    out += `${os.EOL}${os.EOL}${cssInJs(concatenatedCss, addFilePathComments)}`;
  }

  return out;
}

function isFileProcessed(visited, filePath, normalizedFilePath) {
  const visitedList = visited || [];

  return visitedList.includes(filePath)
    || visitedList.includes(normalizedFilePath);
}

// TODO replace with pure function
function buildTree(filePath, parentPath, files) {
  let fullName = filePath;
  // Get full file name
  if (parentPath) {
    fullName = path.join(parentPath, '..', fullName);
  }

  const normalizedFilePath = fileName.normalizeFileName(fullName);

  if (isFileProcessed(files.visited, fullName, normalizedFilePath)) {
    return;
  }

  fullName = getExistingFilePath(fullName, normalizedFilePath, parentPath);

  const file = fs.readFileSync(fullName).toString();
  // Mark file as processed
  files.visited.push(fullName);
  getImports(file).forEach((imprt) => buildTree(imprt, fullName, files));

  if (/\.css$/g.test(fullName)) {
    files.css.push({ file, filePath: fileName.revertSlashes(fullName) });
  } else {
    files.js.push({ file: prepareJs(file), filePath: fileName.revertSlashes(fullName) });
  }
}

module.exports = {
  getConfig,
  createFolderAndFile,
  getExistingFilePath,
  getImports,
  concatFiles,
  buildTree,
  isFileProcessed,
};
