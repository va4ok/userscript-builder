/* eslint-env node, jest */

jest.mock('fs');
jest.mock('../increase-version');
jest.mock('../update-project-package');
jest.mock('../utils');
jest.mock('../meta');
jest.mock('../args');

const fs = require('fs');
const increaseVersion = require('../increase-version');
const updateProjectPackage = require('../update-project-package');
const utils = require('../utils');
const build = require('../build');
const meta = require('../meta');
const args = require('../args');

describe('Build test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    utils.getConfig.mockReturnValue({ meta: { version: '0.0.0' }, entry: './index.js' });
    utils.buildTree.mockReturnValue();
    utils.createFolderAndFile.mockReturnValue('path');
    utils.concatFiles.mockReturnValue('concat files content');
  });

  test('Build dev script', () => {
    args.parse.mockReturnValue({ production: false, noValidate: false });
    increaseVersion.mockReturnValue('0.0.0');

    build();
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith('path', 'concat files content');
    expect(updateProjectPackage).not.toHaveBeenCalled();
    expect(meta.validate).toHaveBeenCalledTimes(1);
  });

  test('Build release script', () => {
    args.parse.mockReturnValue({ major: true });
    increaseVersion.mockReturnValue('1.0.0');

    build();
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith('path', 'concat files content');
    expect(updateProjectPackage).toHaveBeenCalledTimes(1);
    expect(updateProjectPackage).toHaveBeenCalledWith({ version: '1.0.0' });
    expect(meta.validate).toHaveBeenCalledTimes(1);
  });

  test('no validate build', () => {
    args.parse.mockReturnValue({ production: false, noValidate: true });

    build();
    expect(meta.validate).not.toHaveBeenCalled();
  });
});
