const dictLookUp = require('../spellcheck/dictLookUp');
const isValid = require('../spellcheck/validateQuery.js');
const botMsgs = require('./botMsgs');
const {
    errors: {
        inCorrect
    }
} = require('../bot/botMsgs');
const validateQuery = require('../spellcheck/validateQuery.js');


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

    const {
        errors: {
            errorBotText
        }
    } = botMsgs;


    botMsgs['/start'] = userName;

    let botResponse = '';
    if (!incomingMsg) {
        botResponse = errorBotText;
    } else if (botMsgs.hasOwnProperty(incomingMsg)) {
        botResponse = botMsgs[incomingMsg];

    } else {
        // if (isValid(incomingMsg)) { //query validation
        //     botResponse = await dictLookUp(incomingMsg); //getting query result from gramota.ru (do spellchecking)   
        // } else {
        //     botResponse = inCorrect;
        // }

        const checkedMsg = validateQuery(incomingMsg);
        if (checkedMsg) {
            botResponse = await dictLookUp(checkedMsg); //getting query result from gramota.ru (do spellchecking)  
        } else {
            botResponse = inCorrect;
        }
    }
    return botResponse;
}

module.exports = compileReply