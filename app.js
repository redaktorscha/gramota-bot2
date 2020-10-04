const doQuery = require('./doQuery');
const processCurlResponse = require('./processCurlResponse');
const isValid = require('./isValid');
const logError = require('./logError');


const app = async (query) => {
    //console.log(query);
    if (isValid(query)) { //wrap it in async dictLookUp
        try {
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
module.exports = app;
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