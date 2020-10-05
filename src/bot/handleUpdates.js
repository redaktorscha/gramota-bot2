const fs = require('fs');
require('dotenv').config();
const logError = require('../tools/logError');
const getUpdates = require('./getUpdates');
const compileReply = require('./compileReply');
const path = require('path');


/**
 * bot's handler for getting/sending msgs
 */
const handleUpdates = async (method) => {

    if (method === 'polling') {
        try {
            const API_PAGE = `${process.env.TELEGRAM_URL}${process.env.BOT_TOKEN}`;
            const offsetPath = path.join(__dirname, '..', 'tools', 'offset');

            let offset = Number(fs.readFileSync(offsetPath, 'utf-8')) || null;

            const urlQueryStringGet = `${API_PAGE}/getUpdates?offset=${offset + 1}`; //get msgs

            const newMsgs = await getUpdates(true, urlQueryStringGet);

            if (newMsgs.length) {
                console.log(`got ${newMsgs.length} new updates`);

                const replies = newMsgs.map(async msg => { //arr of promises
                    offset = msg.update_id;
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

                    const urlQueryStringSend = `${API_PAGE}/sendMessage?chat_id=${message.chat.id}&text=${encodeURI(botResponse)}&parse_mode=HTML`; //send msgs

                    return getUpdates(false, urlQueryStringSend);
                });

                Promise.all(replies)
                    .catch(err => {
                        console.log(err);
                        throw new Error(err);
                    });

                fs.writeFileSync(offsetPath, offset); // new offset (last user obj);

            } else {
                console.log('no new msgs');
                return;
            }


        } catch (err) {
            console.log(err);
            logError(err);
        }
    } else {
        console.log(method);
    }

}

module.exports = handleUpdates;