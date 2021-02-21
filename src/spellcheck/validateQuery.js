/**
 * @module src/spellcheck/validateQuery
 */
import regexps from '../tools/regexps.js';


/**
 * only cyrillic chars, '*' and '?' are valid ((??? is valid but *** isn't valid))
 * @param {string} query - user's query
 * @returns {(string|null)} - validation result
 */
const validateQuery = (query) => {
    const {
        allowedChars,
        onlyAsteriks
    } = regexps;
    
    let checked = query.match(allowedChars);
    if (checked) {
        checked = checked.join('');
        if (!checked.match(onlyAsteriks) && checked.length < 50) { //long texts are also not valid
            return checked.toLowerCase(); //bugfix
        }
    }

    return null;
}

export default validateQuery;