/* eslint-env node, jest */

const getConfig = jest.fn();
const buildTree = jest.fn();
const createFolderAndFile = jest.fn();
const concatFiles = jest.fn();

module.exports = {
  getConfig,
  buildTree,
  createFolderAndFile,
  concatFiles,
};
