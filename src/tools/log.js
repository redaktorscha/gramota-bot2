/**
 * @module src/tools/log
 */
import fs from 'fs';
import getPath from'./getPath.js';
/**
 * log something for debugging
 * @param {string} funcName - function name
 * @param {string} txt - log text
 */
const log = (funcName = '', txt) => {
    const pathToLog = getPath('log');
    fs.appendFileSync(pathToLog, `${funcName}:${txt}\n`);
}

export default log;