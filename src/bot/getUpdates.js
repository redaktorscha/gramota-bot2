const fetch = require('node-fetch');
const {TelegramAPIError} = require('../tools/customErrors');

/**
 * fetch telegram updates (polling mode)
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
        return; 
    }
}

module.exports = getUpdates;