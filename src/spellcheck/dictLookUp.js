const doQuery = require('./doQuery');
const processCurlResponse = require('./processCurlResponse');
const isValid = require('./isValid');
const logError = require('../tools/logError');
const {errors: {errorGramotaText, inCorrect}} = require('../bot/botMsgs');


const dictLookUp = async (query) => {

    if (isValid(query)) { 
        try {
            const queryResult = await doQuery(query);

            if (!queryResult) {
                return errorGramotaText;
            }
            return processCurlResponse(queryResult);
            
        } catch (err) {
            console.log(err);
            logError(err);
        }
    } else {
        return inCorrect;
    }
}
module.exports = dictLookUp;
//app(word = 'алиса?').then(ret => console.log(ret));
//app('чес*ный').then(ret => console.log(ret));
//123
//***
//авокадо
// пипидастр
// п
// дом книги
// дом
// чес*ный
// корова123
// а
// ???
// а??