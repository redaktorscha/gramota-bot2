/**
 * @module src/tools/log
 */
const fs = require('fs');
const path = require('path');

/**
 * log something for debugging
 * @param {string} funcName - function name
 * @param {string} txt - log text
 */
const log = (funcName = '', txt) => {
    const pathToLog = path.join(__dirname, '..', '..', 'log');
    fs.appendFileSync(pathToLog, `${funcName}:${txt}\n`);
}

module.exports = log;