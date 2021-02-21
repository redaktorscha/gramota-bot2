/** 
 * @module src/spellcheck/dictLookUp
 */

import doQuery from './doQuery.js';
import processCurlResponse from './processCurlResponse.js';
import logError from '../tools/logError.js';
import botMsgs from '../bot/botMsgs.js';



/**
 * check word and return result
 * @param {string} query - word(s) to check
 * @returns {Promise<string>} - readable result with accent marks
 */
const dictLookUp = async (query) => {

    const {
        errors: {
            errorGramotaText
        }
    } = botMsgs;

    try {
        const queryResult = await doQuery(query);
        return processCurlResponse(queryResult);

    } catch (err) {
        logError(err);
        return errorGramotaText;
    }

}
export default dictLookUp;