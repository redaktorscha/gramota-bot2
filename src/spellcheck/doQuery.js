/** 
 * @module src/spellcheck/doQuery
 */

import { GramotaRuError } from '../tools/customErrors.js';
import childProcess from 'child_process';
import logError from '../tools/logError.js';


/**
 * curl request
 * @param {string} word - word(s) to check
 * @returns {Promise<string>} - resolves request result (html string, the whole page)
 */
const doQuery = async (word) => {

    const URL = `${process.env.GRAMOTA_URL}${word}`; //query string
    
    return new Promise((resolve, reject) => {

        childProcess.exec(`curl ${URL} | iconv -f windows-1251 -t utf-8`, (error, stdout) => { 
            if (error) {
                logError(new GramotaRuError(error.message));
                reject(error);
            }

            resolve(stdout);

        });
    });
}

export default doQuery;