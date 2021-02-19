/** 
 * @module src/bot/compileReply
 */

const dictLookUp = require('../spellcheck/dictLookUp');
const botMsgs = require('./botMsgs');
const validateQuery = require('../spellcheck/validateQuery');


/**
 * compile bot's reply depending on user command
 * @param {Object} user - user info
 * @returns {Promise<string>} - bot reply message
 * 
 */

const compileReply = async (user) => {
    const {
        userName,
        incomingMsg
    } = user;

    const {
        errors: {
            errorBotText,
            inCorrect
        }
    } = botMsgs;


    botMsgs['/start'] = userName; //set username 

    let botResponse = '';
    if (!incomingMsg) {
        botResponse = errorBotText;
    } else if (botMsgs.hasOwnProperty(incomingMsg)) {
        botResponse = botMsgs[incomingMsg];

    } else {
        const checkedMsg = validateQuery(incomingMsg);
        if (checkedMsg) {
            botResponse = await dictLookUp(checkedMsg); //getting query result from gramota.ru (do spellchecking)  
        } else {
            botResponse = inCorrect;
        }
    }
    return botResponse;
}

module.exports = compileReply;