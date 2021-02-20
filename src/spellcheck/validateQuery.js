/**
 * @module src/spellcheck/validateQuery
 */

const {
    allowedChars,
    onlyAsteriks
} = require('../tools/regexps');

/**
 * only cyrillic chars, '*' and '?' are valid ((??? is valid but *** isn't valid))
 * @param {string} query - user's query
 * @returns {(string|null)} - validation result
 */
const validateQuery = (query) => {
    let checked = query.match(allowedChars);
    if (checked) {
        checked = checked.join('');
        if (!checked.match(onlyAsteriks) && checked.length < 50) {
            return checked;
        }
    }

    return null;
}

module.exports = validateQuery;