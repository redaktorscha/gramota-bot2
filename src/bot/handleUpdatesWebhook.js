const server = require('./server');
const logError = require('../tools/logError');
const getUpdates = require('./getUpdates');
const compileReply = require('./compileReply');
require('dotenv').config();


/**
 * 
 * @param {Object} msg update obj from Telegram API (one msg at a time)
 */
const handleUpdatesWebhook = async (msg) => {
    try {
        const API_PAGE = `${process.env.TELEGRAM_URL}${process.env.BOT_TOKEN}`;
       
        const {
            message
        } = msg;

        const botResponse = await compileReply({
            userName: message.from.first_name,
            incomingMsg: message.text || '/sticker'
        }).catch(err => {
            console.log(err);
            throw new Error(err);
        });

        const urlQueryStringSend = `${API_PAGE}/sendMessage?chat_id=${message.chat.id}&text=${encodeURI(botResponse)}&parse_mode=HTML`; //send msg

        await getUpdates(false, urlQueryStringSend).catch(err => {
            console.log(err);
            throw new Error(err);
        });
    } catch (err) {
        console.log(err);
        logError(err);
    }
}

module.exports = handleUpdatesWebhook;
//handleUpdatesWebhook();