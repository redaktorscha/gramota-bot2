/**
 * @module ./tools/getPath.js
 */


import path from 'path';
import {
    fileURLToPath
} from 'url';
import {
    dirname
} from 'path';

const __filename = fileURLToPath(
    import.meta.url);

const __dirname = dirname(__filename);

/**
 * returns path to the non js file for es6 import
 * @param {string} filename - name of the file
 * @param {string} options - local path to the file
 * @returns {string} - path to the file
 */

const getPath = (filename, options = '') => path.join(__dirname, options, filename);

export default getPath;