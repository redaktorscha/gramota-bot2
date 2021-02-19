/**
 * @module src/spellcheck/removeTags
 */

import {
    htmlTags
} from '../tools/regexps.js';

/**
 * removes html tags
 * @param {string} html - html string with tags
 * @returns {string} - string without tags
 */
const removeTags = (html) => {
    return html.replace(htmlTags, '');
}

export default removeTags;