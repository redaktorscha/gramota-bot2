/**
 * @module src/spellcheck/pageTargets
 */

 /**
  * @typedef {Object} pageTargets - text that could be found at the dict page
  * @property {string} pageTargets.noWord - the word wasn't found
  * @property {string} pageTargets.similarWords - the word wasn't found but there are similar words in the dictionary
  */
const pageTargets = {
    noWord: 'искомое слово отсутствует',
    similarWords: 'Похожие слова'
};

export default pageTargets;