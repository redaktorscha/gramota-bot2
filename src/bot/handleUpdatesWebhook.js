/**
 * @module src/bot/handleUpdatesWebhook
 */

const logError = require('../tools/logError');
const getUpdates = require('./getUpdates');
const compileReply = require('./compileReply');
const {
    errors: {
        apologize
    }
} = require('./botMsgs');
require('dotenv').config();


/**
 * bot handler for getting/sending msgs (webhook mode)
 * @param {Object} msg update obj from Telegram API (one msg at a time)
 * @returns {Promise<void>}
 */
const handleUpdatesWebhook = async (msg) => {
    try {
        const startTime = Date.now();
        const API_PAGE = `${process.env.TELEGRAM_URL}${process.env.BOT_TOKEN}`;

        const {
            message
        } = msg;

       
           let botResponse = await compileReply({
                userName: message.from.first_name,
                incomingMsg: message.text || '/sticker'
            }).catch(err => {
                throw new Error(err);
            });
     


        const endTime = Date.now();

        if (endTime - startTime > 3000) {
            botResponse += apologize;
        }

        const urlQueryStringSend = `${API_PAGE}/sendMessage?chat_id=${message.chat.id}&text=${encodeURI(botResponse)}&parse_mode=HTML`; //send msg

        await getUpdates(false, urlQueryStringSend).catch(err => {
            throw new Error(err);
        });
    } catch (err) {
        logError(err);
    }
}

module.exports = handleUpdatesWebhook;