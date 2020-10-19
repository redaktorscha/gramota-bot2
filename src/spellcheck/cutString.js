/**
 * @module src/spellcheck/cutString
 */

 /**
  * makes substring containing query result
  * @param {string} str - html string (the whole page)
  * @param {string} closingTag - html tag marking the end of the target substring
  * @returns {(string|null)} - substring containing query result (if found)
  */
const cutString = (str, closingTag) => {
    const substr = 'style="padding-left:50px">';
    const targetIndex = str.indexOf('style="padding-left:50px">');

    if (~targetIndex) {
        const cutIndexLeft = targetIndex + substr.length;

        str = str.slice(cutIndexLeft);

        const cutIndexRight = str.indexOf(closingTag);

        return str.slice(0, cutIndexRight);
    }

    return null;
}

module.exports = cutString;