/* eslint-env node, jest */

const fs = jest.genMockFromModule('fs');
const readdirSync = jest.fn();
const writeFileSync = jest.fn();
const existsSync = jest.fn();

fs.readdirSync = readdirSync;
fs.writeFileSync = writeFileSync;
fs.existsSync = existsSync;

module.exports = fs;
