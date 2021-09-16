# userscript-builder <!-- omit in TOC -->

[![NPM version](https://img.shields.io/npm/v/userscript-builder.svg)](https://www.npmjs.com/package/userscript-builder)

Simple tool for building userscript for tampermonkey.

ES6 modules are not supported.

* Simple configuration.
* Uses ES6 classes syntax.
* Support css files.
* No webpack
* No babel
* The only one third party dependency

Don't forget import css files via ```import 'some-css.css'```. Extension is required.

# Table of Content <!-- omit in TOC -->

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Setup](#setup)
  - [Build options](#build-options)
    - [Dev](#dev)
    - [Release-bugfix (patch)](#release-bugfix-patch)
    - [Release-minor](#release-minor)
    - [Release-major](#release-major)
- [How it works](#how-it-works)
- [Real life example](#real-life-example)
- [Running the tests](#running-the-tests)
- [Built With](#built-with)
- [Authors](#authors)
- [License](#license)
- [History](#history)

## Getting Started

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

Or you can use `npx` as well

```bash
npx userscript-builder --mode dev
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

## Built With

* [minimist](https://github.com/substack/minimist) - Node arguments parser

## Authors

* **Oleg Vaka** - *Initial work* - [va4ok](https://github.com/va4ok)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details

## History

See [CHANGELOG.md](./CHANGELOG.md)
