/**
 * @module src/spellcheck/processCurlResponse
 */

import botMsgs from '../bot/botMsgs.js';
import regexps from '../tools/regexps.js';
import pageTargets from './pageTargets.js';
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

    const {
        containsCyrillic
    } = regexps;

    const {
        noWord,
        similarWords
    } = pageTargets;


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