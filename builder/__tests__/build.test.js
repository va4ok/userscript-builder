/* eslint-env node, jest */

jest.mock('minimist');
jest.mock('fs');
jest.mock('../increase-version');
jest.mock('../update-project-package');
jest.mock('../utils');

const minimist = require('minimist');
const fs = require('fs');
const increaseVersion = require('../increase-version');
const updateProjectPackage = require('../update-project-package');
const utils = require('../utils');
const build = require('../build');

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
    minimist.mockReturnValue({ mode: 'dev' });
    increaseVersion.mockReturnValue('0.0.0');

    build();
    expect(utils.startBuildReport).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith('path', 'concat files content');
    expect(updateProjectPackage).not.toHaveBeenCalled();
    expect(utils.finishBuildReport).toHaveBeenCalledTimes(1);
    expect(utils.finishBuildReport).toHaveBeenCalledWith(null);
  });

  test('Build release script', () => {
    minimist.mockReturnValue({ mode: 'maj' });
    increaseVersion.mockReturnValue('1.0.0');

    build();
    expect(utils.startBuildReport).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith('path', 'concat files content');
    expect(updateProjectPackage).toHaveBeenCalledTimes(1);
    expect(updateProjectPackage).toHaveBeenCalledWith({ version: '1.0.0' });
    expect(utils.finishBuildReport).toHaveBeenCalledTimes(1);
    expect(utils.finishBuildReport).toHaveBeenCalledWith('1.0.0');
  });
});
