const doQuery = require('./doQuery');
const processCurlResponse = require('./processCurlResponse');
const logError = require('../tools/logError');
const {
    errors: {
        errorGramotaText
    }
} = require('../bot/botMsgs');


const dictLookUp = async (query) => {

    try {
        const queryResult = await doQuery(query);
        return processCurlResponse(queryResult);

    } catch (err) {
        console.log(err); //
        logError(err);
        return errorGramotaText;
    }

}
module.exports = dictLookUp;