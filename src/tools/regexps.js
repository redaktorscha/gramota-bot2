/**
 * @module src/tools/regexps
 */

/**
 * @typedef {Object} regexps
 * @property {RegExp} containsCyrillic - for fixing a bug at the dict page
 * @property {RegExp} onlyAsteriks - query consisting of asterisks only isn't valid   
 * @property {RegExp} htmlTags - used for removing html tags
 * @property {RegExp} allowedChars - allowed characters for the query
 */
const regexps = {
    containsCyrillic: /\p{sc=Cyrillic}/u,
    onlyAsteriks: /^\*+$/,
    htmlTags: /<[^>]*>|<*>/g,
    allowedChars: /[а-яё*?]+/ig,
}

module.exports = regexps;