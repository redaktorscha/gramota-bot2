/** 
 * @module src/spellcheck/dictLookUp
 */

const doQuery = require('./doQuery');
const processCurlResponse = require('./processCurlResponse');
const logError = require('../tools/logError');
const {
    errors: {
        errorGramotaText
    }
} = require('../bot/botMsgs');



 /**
  * check word and return result
  * @param {string} query - word(s) to check
  * @returns {string} - readable result with accent marks
  */
const dictLookUp = async (query) => {

    try {
        const queryResult = await doQuery(query);
        return processCurlResponse(queryResult);

    } catch (err) {
        logError(err);
        return errorGramotaText;
    }

}
module.exports = dictLookUp;