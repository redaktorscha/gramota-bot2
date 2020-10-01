const doQuery = require('./doQuery');
const processCurlResponse = require('./processCurlResponse');
const isValid = require('./isValid');
const logError = require('./logError');


const app = async (query) => {

    // if (isValid(query)) {
    //     console.log('Некорректный запрос');
    //     return 'некорректный запрос';
    // }

    // const queryResult = await doQuery(query); //try catch

    // const botReply = processQueryResult(queryResult);

    // console.log(botReply);

    if (isValid(query)) {
        try {
            //await doQuery(query).then(queryResult => console.log(queryResult.slice(0, 250)));
            const queryResult = await doQuery(query);
            return processCurlResponse(queryResult);
        } catch (err) {
            console.log(err);
            logError(err);
        }
    } else {
        return 'Некорректный запрос';
    }
}

//app(word = '')
app('кофе*машина').then(ret => console.log(ret));
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