/**
 * @module src/bot/handleUpdatesPolling
 */


import fs from 'fs';
import dotenv from 'dotenv';
import logError from '../tools/logError.js';
import log from '../tools/log.js';
import getUpdates from './getUpdates.js';
import compileReply from './compileReply.js';
import botMsgs from './botMsgs.js';
import getPath from '../tools/getPath.js';


dotenv.config({
    path: '../../.env'
});


/**
 * bot handler for getting/sending msgs (polling mode)
 * @returns {Promise<void>}
 */
const handleUpdatesPolling = async () => {
    try {
        const startTime = Date.now();
        const API_PAGE = `${process.env.TELEGRAM_URL}${process.env.BOT_TOKEN}`;
        const offsetPath = getPath('offset');

        let offset = Number(fs.readFileSync(offsetPath, 'utf-8')) || null;

        const urlQueryStringGet = `${API_PAGE}/getUpdates?offset=${offset + 1}`; //get msgs

        const {
            errors: {
                apologize
            }
        } = botMsgs;

        const newMsgs = await getUpdates(true, urlQueryStringGet);

        if (newMsgs.length) {
            log(handleUpdatesPolling.name, `got ${newMsgs.length} new updates`);

            const replies = newMsgs.map(async msg => { //arr of promises
                offset = msg.update_id;
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
                if (endTime - startTime > 5000) {
                    botResponse += apologize;
                }

                const urlQueryStringSend = `${API_PAGE}/sendMessage?chat_id=${message.chat.id}&text=${encodeURI(botResponse)}&parse_mode=HTML`; //send msgs

                return getUpdates(false, urlQueryStringSend);
            });

            Promise.all(replies)
                .catch(err => {
                    throw new Error(err);
                });

            fs.writeFileSync(offsetPath, offset.toString()); // new offset (last user obj);

        } else {
            log(handleUpdatesPolling.name, 'no new msgs');
            return;
        }


    } catch (err) {
        logError(err);
    }
}

export default handleUpdatesPolling;
