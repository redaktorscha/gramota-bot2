/**
 * Bot messages
 * @module src/bot/botMsgs
 */

/**
 * @typedef {Object} botMsgs - bot responses
 * @property {Object} searching - messages for query results
 * @property {string} searching.notFound - bot message if the word wasn't found
 * @property {string} searching.foundSimilar - bot message if there are similar words in the dictionary but not the word given
 * @property {Object} errors - bot messages on error
 * @property {string} errors.errorBotText - if bot error occured
 * @property {string} errors.errorGramotaText - if dictionary page is not working
 * @property {string} errors.inCorrect - query isn't correct
 * @property {string} errors.apologize - query took too long
 * 
 */

const botMsgs = {

    searching: {
        notFound: 'Извините, слово не найдено',
        foundSimilar: 'Искомое слово отсутствует; похожие слова: ',
    },

    /**
     * Set bot text on start command
     * @param {string} un - user name
     */
    set '/start'(un) {
        this._start = `Здравствуйте, ${un}!\nНапишите слово или словосочетание, и я проверю его по орфографическому словарю на сайте «Грамота.ру».\n
    Для справки — команда <b>/help</b>`;
    },
    /**
     * Get bot text on start command
     * @returns {string}
     */
    get '/start'() {
        return this._start;
    },

    '/help': `Проверка производится по «Академическому орфографическому словарю» на портале gramota.ru.\n
    Пожалуйста, используйте для поиска начальную форму слова:
    не <i>гуглил</i>, а <i>гуглить</i>; не <i>дома книги</i>, а <i>дом книги</i>.\n
    Можно использовать подстановочные символы 'звездочка' (*) и 'вопросительный знак' (?), например:\n
   <b>аген*ство</b>, <b>проф*ес*ор</b>, <b>кофе*брейк</b>, <b>в*продолжени*</b>, <b>к*рдинально</b>, <b>на*вырост</b>, <b>е*э*с</b>.\n
   <b>??а</b> (слова из трех букв, последняя - А), <b>к????</b>, <b>??</b>.\n
    (c) Научно-информационный «Орфографический академический ресурс АКАДЕМОС» Института русского языка им. В. В. Виноградова РАН.\n
    (c) Справочно-информационный портал "Грамота.ру".\n
    Автор бота — @redaktorscha.\n
    Помочь проекту: https://yoomoney.ru/to/41001101358658`,


    '/sticker': '🙂',


    errors: {
        errorBotText: `Кажется, я сломался. Зайдите позже, пожалуйста`,
        errorGramotaText: `Увы, проблемы на сайте «Грамота.ру». Давайте попробуем еще раз через пять минут?`,
        inCorrect: 'Некорректный запрос',
        apologize: '\n Простите за ожидание',
    }
}

export default botMsgs;