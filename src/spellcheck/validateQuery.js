/**
 * @module src/spellcheck/validateQuery
 */

import {
    allowedChars,
    onlyAsteriks
} from '../tools/regexps.js';

/**
 * only cyrillic chars, '*' and '?' are valid ((??? is valid but *** isn't valid))
 * @param {string} query - user's query
 * @returns {(string|null)} - validation result
 */
const validateQuery = (query) => {
    let checked = query.match(allowedChars);
    if (checked) {
        checked = checked.join('');
        if (!checked.match(onlyAsteriks)) {
            return checked;
        }
    }

    return null;
}

export default validateQuery;