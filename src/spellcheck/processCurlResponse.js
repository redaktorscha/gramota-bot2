/**
 * @module src/spellcheck/processCurlResponse
 */

const {
    containsCyrillic
} = require('../tools/regexps');

const {
    noWord,
    similarWords
} = require('./pageTargets');

const {
    searching: {
        notFound,
        foundSimilar
    }

} = require('../bot/botMsgs');

const cutString = require('./cutString');
const makeReadable = require('./makeReadable');

/**
 * parse html, find and process query result
 * @param {string} htmlStr - curl request result (html)
 * @returns {string} - readable query result
 */
const processCurlResponse = (htmlStr) => {

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
module.exports = processCurlResponse;