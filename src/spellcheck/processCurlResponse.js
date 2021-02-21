/**
 * @module src/spellcheck/processCurlResponse
 */

import botMsgs from './botMsgs.js';

import {
    containsCyrillic
} from '../tools/regexps.js';

import {
    noWord,
    similarWords
} from './pageTargets.js';



import cutString from './cutString.js';
import makeReadable from './makeReadable.js';

/**
 * parse html, find and process query result
 * @param {string} htmlStr - curl request result (html)
 * @returns {string} - readable query result
 */
const processCurlResponse = (htmlStr) => {

    const {
        searching: {
            notFound,
            foundSimilar
        }
    
    } = botMsgs;

    let reply = '';

    if (htmlStr.includes(noWord)) {
        return notFound;
    }

    let cutStr;

    if (htmlStr.includes(similarWords)) {
        cutStr = cutString(htmlStr, '</p');

        if (!containsCyrillic.test(cutStr)) {
            return notFound;
        }
        reply = foundSimilar;
    } else {
        cutStr = cutString(htmlStr, '</div');
        if (!cutStr) {
            return notFound;
        }
    }

    cutStr = makeReadable(cutStr);

    return `${reply}${cutStr}`;
}
export default processCurlResponse;