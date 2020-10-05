
const insertLineBreaks = require('./insertLineBreaks');
const insertAccents = require('./insertAccents');
const removeTags = require('./removeTags');


const makeReadable = (str) => {

    if (str.includes('<br><br>')) {
        str = insertLineBreaks(str);
    }

    return removeTags(insertAccents(str));
}

module.exports = makeReadable;