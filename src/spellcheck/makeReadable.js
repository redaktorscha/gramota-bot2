/**
 * @module src/spellcheck/makeReadable
 */
const insertLineBreaks = require('./insertLineBreaks');
const insertAccents = require('./insertAccents');
const removeTags = require('./removeTags');

/**
 * makes readable string from html
 * @param {string} str - html string containing query results
 * @returns {string} - string with line breakes, accent marks and without html tags
 */
const makeReadable = (str) => {

    if (str.includes('<br><br>')) {
        str = insertLineBreaks(str);
    }

    return removeTags(insertAccents(str));
}

module.exports = makeReadable;