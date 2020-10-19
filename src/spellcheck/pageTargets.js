/**
 * @module src/spellcheck/pageTargets
 */

 /**
  * @typedef {Object} pageTargets
  * @property {string} pageTargets.noWord - part of bot reply (in case when the word wasn't found)
  * @property {string} pageTargets.similarWords - part of bot reply (in case when the word wasn't found but there are similar words in the dictionary)
  */
const pageTargets = {
    noWord: 'искомое слово отсутствует',
    similarWords: 'Похожие слова'
};

module.exports = pageTargets;