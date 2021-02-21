/**
 *@module src/spellcheck/insertLineBreaks
 */

/**
 * cuts <br><br> that appears at the end of the string and inserts '/n' if the string contains more than one word
 * @param {string} str - html string
 * @returns {string} - hntl string
 */

const insertLineBreaks = (str) => {
    if (str.indexOf('<br><br>') === str.length - 8) {
        str = str.slice(0, -8); //cut 
    }

    if (str.includes('<br><br>')) { //if
        str = str.split('<br><br>').join('\n')
    }

    return str;
}

export default insertLineBreaks;