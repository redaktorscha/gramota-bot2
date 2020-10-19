/**
 * @module src/tools/logError
 */
const fs = require('fs');
const path = require('path');

/**
 * logs errors
 * @param {Error} error
 */
const logError = (error) => {
    const pathToErrorLog = path.join(__dirname, '..', '..', 'error-log');
    const date = new Date().toLocaleString();
    fs.appendFileSync(pathToErrorLog, `${date}:${error.stack}\n`);
}

module.exports = logError;