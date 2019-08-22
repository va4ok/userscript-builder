# userscript-builder

Tool for building userscript for tampermonkey. Uses ES6 classes.

## Getting Started

Update Your package.json with userscript section

```bash
{
  "name": "git-name",
  "version": "0.0.0",
  "description": "Describe your user script",
  "author": "va4ok",
  "license": "MIT",
  "userscript": {
    "entry": "./src/index.js",     // Entry file
    "dev": "./dist",               // Output folder for dev builds
    "release": "./release",        // Output folder for release builds
    "fileName": "filename",        // Output filename -> filename.user.js
    "meta": {                      // Userscript meta info
      "name": "Jira Task2Branch",
      "namespace": "http://tampermonkey.net/",
      "homepage": "https://openuserjs.org/scripts/va4ok",
      "match": "*://*.*",
      "grant": "none"
    }
  }
}
```

Fields version, description, author, license will be used in output meta.

Default properties if not specified

```bash
  entry: './src/index.js',
  dev: './dist',
  release: './release',
  fileName: 'new-userscript'

  name: 'New Userscript',
  namespace: 'http://tampermonkey.net/',
  version: '0.0.0',
  description: 'try to take over the world!',
  author: 'You',
  match: 'http://*/*',
  grant: 'none'
```

Please visit https://www.tampermonkey.net/ for more details and options.

### Prerequisites

It works with NodeJS v10.16.0 or higher. Lower versions of NodeJS wasn't tested.

### Install

Install with npm:

```bash
npm install --save-dev userscript-builder
```

Install with yarn:

```bash
yarn add userscript-builder --dev
```

## Running the tests

Not implemented yet.

## Built With

* [minimist](https://github.com/substack/minimist) - Node arguments parser

## Authors

* **Oleg Vaka** - *Initial work* - [va4ok](https://github.com/va4ok)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
