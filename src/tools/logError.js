/**
 * @module src/tools/logError
 */
import fs from 'fs';
import getPath from './getPath.js';

/**
 * logs errors
 * @param {Error} error
 */
const logError = (error) => {
    const pathToErrorLog = getPath('error-log', '../..');
    const date = new Date().toLocaleString();
    fs.appendFileSync(pathToErrorLog, `${date}:${error.stack}\n`);
}

export default logError;