'use strict';

const path = require('path');
const fs = jest.genMockFromModule('fs');

let mockFiles = Object.create(null);

function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

function writeFileSync(filePath, file) {
  mockFiles[filePath] = file;
}

function existsSync() {
  return false;
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.writeFileSync = writeFileSync;
fs.existsSync = existsSync;

jest.spyOn(fs, 'writeFileSync');
jest.spyOn(fs, 'existsSync');

module.exports = fs;
