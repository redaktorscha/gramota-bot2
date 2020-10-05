const accents = require('./accents');

const insertAccents = (str) => {

    return str
        .split(`<span class="accent">`) //letters with accent marks got css class 'accent'

        .map(el => {

            if (accents.includes(el[0])) {
                let accentLetter = el[0];
                accentLetter = accentLetter.toUpperCase() === accentLetter ? `${accentLetter}\u0341` : `${accentLetter}\u0301`;
                el = `${accentLetter}${el.slice(1)}`;
            }
            return el;
        })
        .join('');
}

module.exports = insertAccents;