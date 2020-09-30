//processes html from curl 
//@arg {string} html
//const fs = require('fs');
const {
    containsCyrillic
} = require('./regexps');

const processQueryResult = (htmlStr) => {

    if (htmlStr.includes('искомое слово отсутствует')) {
        return 'Извините, слово не найдено';
    }

    const cutIndexLeft = htmlStr.indexOf('style="padding-left:50px');
    let cuttedStr = htmlStr.slice(cutIndexLeft);

    //console.log('str: ', cuttedStr);

    //console.log(htmlStr.includes('искомое слово отсутствует'));

    if (htmlStr.includes('Похожие слова')) {
        const cutIndexRight = cuttedStr.indexOf('/p');
        cuttedStr = cuttedStr.slice(0, cutIndexRight);
        console.log('str: ', cuttedStr);
        //const cuttedStr = htmlStr.slice(); //!!! cutStr, removeTags

        if (!containsCyrillic.test(cuttedStr)) {
            return 'Извините, слово не найдено';
        }

        return `Искомое слово отсутствует; похожие слова: `; //!!

    }

    const cutIndexRight = cuttedStr.indexOf('/div');
    cuttedStr = cuttedStr.slice(0, cutIndexRight);
    console.log('str: ', cuttedStr);

    return 'Cлово найдено';

}
module.exports = processQueryResult;
//processQueryResult(fs.readFileSync('./output-test', 'utf8'));