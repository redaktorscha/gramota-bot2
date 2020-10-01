const accents = require('./accents');

const insertAccents = (str) => {

    return str
        .split(`<span class="accent">`) //letters with accent marks got css class 'accent'

        .map(el => {
            if (accents.hasOwnProperty(el[0])) {
                el = accents[el[0]] + el.slice(1);
            }
            return el;
        })
        .join('');
}

module.exports = insertAccents;