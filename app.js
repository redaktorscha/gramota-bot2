const doQuery = require('./doQuery');
const processQueryResult = require('./processQueryResult');
const isValid = require('./isValid');
const logError = require('./logError');
//require('dotenv').config(); URL here


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
            return processQueryResult(queryResult);
        } catch (err) {
            console.log(err);
            logError(err);
        }
    } else {
        return 'Некорректный запрос';
    }
}

//app(word = '')
app('п').then(ret => console.log(ret));
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