require('dotenv').config();
const fetch = require('node-fetch');
const logError = require('./logError');
const fs = require('fs');
const TelegramAPIError = require('./customErrors');
const API_PAGE = `${process.env.TELEGRAM_URL}${process.env.BOT_TOKEN}`;
const app = require('./app');


//const delay = promisify(setTimeout);

/**
 * fetch telegram API (GET method)
 * @param {boolean} get getting messages or sending replies
 * @param {string} url url query string
 * @returns {Promise} returns update obj from API
 */
const getUpdates = async (get, url) => {

    const responseAPI = await fetch(url);

    if (!responseAPI.ok) {
        console.log(responseAPI.statusText);
        throw new TelegramAPIError(responseAPI.statusText);
    };

    if (get) {
        const {
            result
        } = await responseAPI.json();
        return result; //arr of users info, msgs etc

    } else {
        return; //return true??
    }
}

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

    let botResponse = '';

    if (incomingMsg === '/start') { //start command reaction
        botResponse = `Hello, ${userName}!`
    } else if (incomingMsg === '/help') { //help command reaction
        botResponse = 'let me help you'
    } else if (incomingMsg === '/sticker') { //sticker reaction
        botResponse = '🙂';
    } else {
        botResponse = await app(incomingMsg);
        //botResponse = `Looking for ${incomingMsg}...`; //getting query result from gramota.ru
    }
    return botResponse; //no empty msg?
}


/**
 * bot's handler for getting/sending msgs
 */
const handleUpdates = async () => {

    try {
        let offset = Number(fs.readFileSync('./offset', 'utf-8')) || null; //used for getting new msgs only

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
                }); //????

                const urlQueryStringSend = `${API_PAGE}/sendMessage?chat_id=${message.chat.id}&text=${encodeURI(botResponse)}&parse_mode=HTML`; //send msgs

                return getUpdates(false, urlQueryStringSend);
            });

            Promise.all(replies)
                .catch(err => {
                    console.log(err);
                    throw new Error(err);
                });

            fs.writeFileSync('./offset', offset); // new offset (last user obj);

        } else {
            console.log('no new msgs');
            return;
        }


    } catch (err) {
        console.log(err);
        logError(err);
    }
}

// (async () => {
//     while (true) {
//         await handleUpdates().catch(err => {
//             console.log(err);
//         });
//         await new Promise(resolve => setTimeout(resolve, 5000));
//     }

// })()

handleUpdates()