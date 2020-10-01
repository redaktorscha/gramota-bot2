//processes html from curl response
//@arg {string} html
//const fs = require('fs');
const {
    containsCyrillic
} = require('./regexps');

const cutString = require('./cutString');
const makeReadable = require('./makeReadable');


const processCurlResponse = (htmlStr) => {

    let reply = '';

    if (htmlStr.includes('искомое слово отсутствует')) {
        return 'Извините, слово не найдено';
    }

    let cutStr;

    if (htmlStr.includes('Похожие слова')) {
        cutStr = cutString(htmlStr, '</p');
        //console.log('str: ', cutStr);       

        if (!containsCyrillic.test(cutStr)) {
            return 'Извините, слово не найдено';
        }
        reply = 'Искомое слово отсутствует; похожие слова: ';

        // if (cutStr.includes('<br><br>')) {
        //     cutStr = makelineBreaks(cutStr);
        // }

        // return `Искомое слово отсутствует; похожие слова: `; //!!

    } else {
        cutStr = cutString(htmlStr, '</div');
    }
    
    cutStr = makeReadable(cutStr);
    //console.log('str: ', cutStr);

    return `${reply}${cutStr}`;

    //console.log('str: ', cutStr);
}
module.exports = processCurlResponse;