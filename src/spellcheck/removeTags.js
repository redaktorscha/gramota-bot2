/**
 * @module src/spellcheck/removeTags
 */

const {
    htmlTags
} = require('../tools/regexps');

/**
 * removes html tags
 * @param {string} html - html string with tags
 * @returns {string} - string without tags
 */
const removeTags = (html) => {
    return html.replace(htmlTags, '');
}

module.exports = removeTags;