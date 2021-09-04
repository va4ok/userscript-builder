'use strict';
const defaults = require('./defaults');

const prepareConfig = (packageJson) => {
  let config;

// default -> package -> userscript
  if (packageJson) {
    let source = '';

    if (packageJson.repository) {
      source = packageJson.repository.url !== undefined ? packageJson.repository.url : packageJson.repository
    }

    const meta = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      author: packageJson.author,
      source,
      license: packageJson.license
    };

    if (packageJson.userscript) {
      config = {...defaults.config, ...packageJson.userscript};
      config.meta = {...defaults.meta, ...meta, ...(packageJson.userscript.meta || {})};
    } else {
      config = {...defaults.config};
      config.meta = {...defaults.meta, ...meta};
    }
  } else {
    config = {...defaults.config, meta: defaults.meta};
  }

  return config;
};

module.exports = prepareConfig;
