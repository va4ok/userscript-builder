'use strict';
const defaults = require('./defaults');
const path = require('path');

function init() {
  const packageJson = require(path.join(process.env.INIT_CWD, 'package'));

  let config = null;

  const meta = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    author: packageJson.author,
    source: packageJson.repository.url,
    license: packageJson.license
  };

  // default -> package -> userscript
  if (packageJson.userscript) {
    config = {...defaults.config, ...packageJson.userscript};
    config.meta = {...defaults.meta, ...meta, ...(packageJson.userscript.meta || {})};
  } else {
    config = {...defaults.config};
    config.meta = {...defaults.meta, ...meta};
  }

  module.exports = config;
}

init();
