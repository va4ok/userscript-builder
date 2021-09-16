# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.4.0](https://github.com/va4ok/userscript-builder/compare/v0.3.0...v0.4.0) (2021-09-16)


### Features

* change color schema in output console ([f869055](https://github.com/va4ok/userscript-builder/commit/f8690559cadb40e6121e0a9f9177b7949ff228e9)), closes [#23](https://github.com/va4ok/userscript-builder/issues/23)


### Bug Fixes

* get user name from author.name if exists ([4a54612](https://github.com/va4ok/userscript-builder/commit/4a546124aaab2446fe2a411b355924995970663e)), closes [#34](https://github.com/va4ok/userscript-builder/issues/34)
* read file error if no package json and release mode ([27e325f](https://github.com/va4ok/userscript-builder/commit/27e325fc70c2521fd8ec70aff9db36d29e7c1ca2))
* update tests with added script ([50e0f47](https://github.com/va4ok/userscript-builder/commit/50e0f4782044acb1aac5d8f21565a03c99ddf5e8))
* unicode syntax error in template string appending to css style
  [PR 31](https://github.com/va4ok/userscript-builder/pull/31)


### Docs

* make it easier to getting started ([4f7439a](https://github.com/va4ok/userscript-builder/commit/4f7439aac591ac8c79bbae56d71b4ebb2854a139)), closes [#28](https://github.com/va4ok/userscript-builder/issues/28)
* update README.md ([eaf1f70](https://github.com/va4ok/userscript-builder/commit/eaf1f70a1d75a929c23490ffa86d80495c8cd198)), closes [#11](https://github.com/va4ok/userscript-builder/issues/11)



## 0.3.0

### Features

* Skip empty meta info.
* Remove ```default``` keyword in class declaration.
* Remove code comments in release mode.

### Bug Fixes

* Remove ```git+``` from source.

## 0.2.0

### Features

* Support for arrays of meta values

## 0.1.6

### Bug Fixes

* Default file extension .js is used if extension is not defined into import line

## 0.1.5

### Bug Fixes

* Remove source path comments in code built in release mode

## 0.1.4

### Bug Fixes

* Remove leading dot for entry file

## 0.1.3

### Bug Fixes

* Build progress available for css files

## 0.1.2

### Bug Fixes

* Add examples

## 0.1.1

### Bug Fixes

* Fix Current Working Directory using

## 0.1.0
### Features

* Dev and release modes support