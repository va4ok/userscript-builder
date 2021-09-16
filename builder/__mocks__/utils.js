/* eslint-env node, jest */

const getConfig = jest.fn();
const startBuildReport = jest.fn();
const buildTree = jest.fn();
const createFolderAndFile = jest.fn();
const concatFiles = jest.fn();
const updatePackageJson = jest.fn();
const finishBuildReport = jest.fn();

module.exports = {
  getConfig,
  startBuildReport,
  buildTree,
  createFolderAndFile,
  concatFiles,
  updatePackageJson,
  finishBuildReport,
};
