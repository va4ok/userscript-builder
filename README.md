# userscript-builder <!-- omit in TOC -->

[![NPM version](https://img.shields.io/npm/v/userscript-builder.svg)](https://www.npmjs.com/package/userscript-builder)

Simple tool for building userscript for tampermonkey.

ES6 modules are not supported.

* Simple configuration.
* Uses ES6 classes syntax.
* Support css files.
* No webpack
* No babel
* No third party

Don't forget import css files via ```import 'some-css.css'```. Extension is required.

# Table of Content <!-- omit in TOC -->

- [userscript-builder ](#userscript-builder-)
- [Table of Content ](#table-of-content-)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Install and run](#install-and-run)
    - [Setup](#setup)
    - [Build options](#build-options)
      - [Production or development](#production-or-development)
      - [Validation](#validation)
      - [Update package json version](#update-package-json-version)
    - [\[DEPRECATED\] Build options (OLD API)](#deprecated-build-options-old-api)
      - [Dev](#dev)
      - [Release-bugfix (patch)](#release-bugfix-patch)
      - [Release-minor](#release-minor)
      - [Release-major](#release-major)
  - [How it works](#how-it-works)
  - [Real life example](#real-life-example)
  - [Running the tests](#running-the-tests)
  - [Authors](#authors)
  - [License](#license)
  - [History](#history)

## Getting Started

### Prerequisites

It works with NodeJS v14. Other versions of NodeJS wasn't tested.

### Install and run

```bash
# npm
npm install --save-dev userscript-builder
npm run userscript-builder

# yarn
yarn add userscript-builder
yarn userscript-builder

# npx
npx userscript-builder
```

### Setup

Update your package.json scripts section (provide aliases)

```json
{
  "scripts": {
    "build": "userscript-builder --mode dev",
    "release:bugfix": "userscript-builder --mode bugfix",
    "release:minor": "userscript-builder --mode minor",
    "release:major": "userscript-builder --mode major"
  }
}
```

Update your package.json with userscript section

```json
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
      "name": "User script name",
      "namespace": "http://tampermonkey.net/",
      "homepage": "https://openuserjs.org/scripts/va4ok",
      "match": "*://*.*",
      "grant": "none",
      "require": [
        "https://some.url.1",
        "https://some.url.2"
      ]
    }
  }
}
```

Fields version, description, author, license will be used in output meta.

Default properties if not specified

```json
{
  "entry": "./src/index.js",
  "dev": "./dist",
  "release": "./release",
  "fileName": "new-userscript",

  "name": "New Userscript",
  "namespace": "http://tampermonkey.net/",
  "version": "0.0.0",
  "description": "try to take over the world!",
  "author": "You",
  "match": "http://*/*",
  "grant": "none"
}
```

Please visit https://www.tampermonkey.net/ for more details and options.

### Build options

#### Production or development

```bash
# build production
npm run userscript-builder --production
npm run userscript-builder --prod
npm run userscript-builder

# development
npm run userscript-builder --development
npm run userscript-builder --dev
```

Development build will add comments about included files.

Development output folder will be set from `userscript.dev` or `userscript.release` 
according to build mode.

#### Validation

By default builder will validate meta tags with lightweight rules and display issues.
Validation can be skipped if you need by adding `--no-validate` argument.

```bash
npm run userscript-builder --no-validate
npx userscript-builder --no-validate
```

#### Update package json version

```bash
# patch version 2.7.1 -> 2.7.2
npm run userscript-builder --release-patch
# minor version 2.7.1 -> 2.8.0
npm run userscript-builder --release-minor
# major version 2.7.1 -> 3.0.0
npm run userscript-builder --release-major
```

### [DEPRECATED] Build options (OLD API)

#### Dev

No version changes.

In result file will be added comments with included file location

```bash
npm run userscript-builder --mode dev
# or
npx userscript-builder --mode dev
```

#### Release-bugfix (patch)

New `patch` version will be increased and commited into package.json file

From result file will be removed single and multi line comments

```bash
npm run userscript-builder --mode bugfix
# or
npm run userscript-builder --mode bug
# 2.7.1 -> 2.7.2
```

#### Release-minor

New `minor` version will be increased and commited into package.json file

From result file will be removed single and multi line comments

```
npm run userscript-builder --mode minor
# or
npm run userscript-builder --mode min
2.7.1 -> 2.8.0
```

#### Release-major

New `major` version will be increased and commited into package.json file

From result file will be removed single and multi line comments

```
npm run userscript-builder --mode major
# or
npm run userscript-builder --mode maj
2.7.1 -> 3.0.0
```


## How it works

Create your entry file with selfexecuted function

```javascript
import { Class1 } from './class1/class1.js';
import { StaticClass } from './static-class/static-class.js';

(function () {
  'use strict';

  const class1 = new Class1();

  class1.doSomething();
  StaticClass.saySomething();
})();
```

Use ES6 classes and imports to organize you code.

```javascript
import { StaticClass } from './../static-class/static-class.js';
import './class1.css';

const CLASS1_CONST = 200;
 
 export class Class1 {
   doSomething() {
     console.log('Class 1');
   }
 }
```

Build your user script and publish on https://openuserjs.org

```javascript
// ==UserScript==
// @name         User script name
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  description
// @author       va4ok
// @match        *://*.*
// @grant        none
// @source       https://github.com/va4ok/userscript-builder.git
// @license      MIT
// @homepage     https://openuserjs.org/scripts/va4ok
// @require      https://some.url.1
// @require      https://some.url.2
// ==/UserScript==

// src/static-class/static-class.js
class StaticClass {
  static saySomething() {
    console.log('static class method');
  }
}

// src/class1/class1.js
const CLASS1_CONST = 200;

class Class1 {
  doSomething() {
    console.log('Class 1');
  }
}

// ./src/index.js
let notificator;

(function () {
  'use strict';

  const class1 = new Class1();

  class1.doSomething();
  StaticClass.saySomething();
})();

// CSS injection
(function(){
  const $style = document.createElement('style');

  $style.innerHTML = `/* src/class1/class1.css */
.class1-container {
  transition: height 1s ease-out;
  background-color: #3dcd59;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  height: 0;
  z-index: 1000;
}`;
  document.body.appendChild($style);
})();
```

## Real life example

Please visit https://github.com/va4ok/jira2git-tools to see real life example.

## Running the tests

```bash
npm run test
```

## Authors

* **Oleg Vaka** - *Initial work* - [va4ok](https://github.com/va4ok)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details

## History

See [CHANGELOG.md](./CHANGELOG.md)
