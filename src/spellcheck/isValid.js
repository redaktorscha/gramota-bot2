
const {
    latinNumbersSpecChars,
    onlyAsteriks
} = require('../tools/regexps');

//check word or phrase from user (it shoudn't contain numbers or latin chars or cpecial characters except for * or ? (??? is valid but *** isn't valid))

const isValid = (query) => {
    return !(latinNumbersSpecChars.test(query) || onlyAsteriks.test(query) || !query);
}

module.exports = isValid;
