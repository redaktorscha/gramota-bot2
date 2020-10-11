const {
    allowedChars,
    onlyAsteriks
} = require('../tools/regexps');

//check word or phrase from user (it shouldn't contain numbers or latin chars or special characters except for * or ? (??? is valid but *** isn't valid))

/**
 * 
 * @param {string} query 
 */
const validateQuery = (query) => {
    
    let checked = query.match(allowedChars);

    if (!checked || query.match(onlyAsteriks)) {
        return null;
    }

   // query = query.match(allowedChars) && onlyAsteriks.test(query);
    //query = query.length ? query.join('') : null;

    // if (onlyAsteriks.test(query)) {
    //     return null;
    // }
    return checked.join('');
}

module.exports = validateQuery;