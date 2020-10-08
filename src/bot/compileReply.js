const dictLookUp = require('../spellcheck/dictLookUp');
const botMsgs = require('./botMsgs');

/**
 * compile bot's reply depending on user command
 * @param {Object} user user info
 * @returns {Promise} string
 * 
 */
const compileReply = async (user) => {
    const {
        userName,
        incomingMsg
    } = user;

    const {errors: {errorBotText}} = botMsgs;


    botMsgs['/start'] = userName;

    let botResponse = '';
    if (!incomingMsg) { //isValid here!!!!!!! + check for emoji => answer with smile??
        botResponse = errorBotText;
    } else if (botMsgs.hasOwnProperty(incomingMsg)) {
        botResponse = botMsgs[incomingMsg];
    
    

    // if (incomingMsg === '/start') { //start command reaction
    //     botResponse = `Hello, ${userName}!`
    // } else if (incomingMsg === '/help') { //help command reaction
    //     botResponse = 'let me help you'
    // } else if (incomingMsg === '/sticker') { //sticker reaction
    //     botResponse = '🙂';
    } else {
        botResponse = await dictLookUp(incomingMsg);//getting query result from gramota.ru (do spellchecking)       
    }
    //return botResponse += `\n Простите, моя разработчица меня еще отлаживает. Я буду готов через пару недель. Сейчас вам поможет Орфобот Мефодий 2: @russian_spelling_bot`; //no empty msg?
    return botResponse;
}

module.exports = compileReply
