/**
 * @module src/spellcheck/makeReadable
 */
import insertLineBreaks from './insertLineBreaks.js';
import insertAccents from './insertAccents.js';
import removeTags from './removeTags.js';

/**
 * makes readable string from html
 * @param {string} str - html string containing query results
 * @returns {string} - string with line breakes, accent marks and without html tags
 */
const makeReadable = (str) => {

    if (str.includes('<br><br>')) {
        str = insertLineBreaks(str);
    }

    if (str.includes(`<span class="accent">`)) {
        return removeTags(insertAccents(str));
    } else {
        return removeTags(str);
    }

}

export default makeReadable;