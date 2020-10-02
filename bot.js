require('dotenv').config();
const fetch = require('node-fetch');
//const childProcess = require('child_process');
const logError = require('./logError');
const fs = require('fs');
const API_PAGE = `${process.env.TELEGRAM_URL}${process.env.BOT_TOKEN}`;

const getUpdates = async () => { //можно сделать один метод для получения и отправки

    //const API_PAGE = `${process.env.TELEGRAM_URL}${process.env.BOT_TOKEN}/getUpdates`;
    let offset = Number(fs.readFileSync('./offset', 'utf-8'));

    const response = await fetch(`${API_PAGE}/getUpdates?offset=${offset + 1}`); //getUpdates?offset="
    //const response = await fetch(`${API_PAGE}/getUpdates`);
    if (!response.ok) {
        //throw new Error(response.statusText);
        console.log(response.statusText);
    };
    const {
        result
    } = await response.json();
    //console.log(result);
    return result;
}


const replyMessages = async (userId, userName, incomingMsg) => { //compileReply & replyMessages
    let botResponse = '';
    if (incomingMsg === '/start') {
        botResponse = `Hello, ${userName}!`
    } else if (incomingMsg === '/help') {
        botResponse = 'Сейчас помогу!'
    } else if (!incomingMsg) {
        botResponse = '🙂';
    } else {
        botResponse = `Ищем ${incomingMsg}`;
    }

    const response = await fetch(`${API_PAGE}/sendMessage?chat_id=${userId}&text=&${botResponse}`);
    if (!response.ok) {
        //throw new Error(response.statusText);
        console.log(response.statusText);
    };
    const {
        result
    } = await response.json();
    //console.log(result);
    return result;

}


// const getMessages = async () => {

//     const updates = await getUpdates();
//     //console.log(updates[updates.length-1].message.chat.id);
//     return updates;
//     // updates.forEach(item => {
//     //     const {
//     //         message
//     //     } = item;


//     //     // if (message.sticker) {
//     //     //     console.log(message.sticker);
//     //     // } else {
//     //     //     console.log(`${message.from.first_name} said: ${message.text}`);
//     //     // }        

//     // })

// }

const handleUpdates = async () => { //userName, type, text

    try {
        const newMsgs = await getUpdates();

        if (newMsgs.length) {
            console.log(`got ${newMsgs.length} new updates`);
            let offset = null;
            const replies = newMsgs.map(msg => {
                offset = msg.update_id;
                const {
                    message
                } = msg;
                const usrName = message.from.first_name;
                const text = message.text || '/sticker';
                const chatId = message.chat.id;
                console.log(usrName, text, chatId);
                return replyMessages(chatId, usrName, text) //userId, userName, incomingMsg

            });
            Promise.all(replies)
                .then(rets => {
                    rets.forEach(ret => console.log(ret.status))
                })
                .catch(err => {
                    console.log(err);
                    logError(err);
                });

            fs.writeFileSync('./offset', offset); //console.log(offset);
        } else {
            console.log('no new msgs');
            return;
        }


    } catch (err) {
        console.log(err);
        logError(err);
    }


}

handleUpdates();