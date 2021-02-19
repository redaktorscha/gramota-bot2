/**
 * @module src/bot/handleUpdatesWebhook
 */

import logError from '../tools/logError.js';
import getUpdates from './getUpdates.js';
import compileReply from './compileReply.js';
import botMsgs from './botMsgs.js';
import dotenv from 'dotenv';

dotenv.config({
    path: '../../.env'
});

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
            errors: {
                apologize
            }
        } = botMsgs;

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

export default handleUpdatesWebhook;