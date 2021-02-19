/**
 * @module src/bot/getUpdates
 */

import fetch from 'node-fetch';
import {TelegramAPIError} from '../tools/customErrors.js';

/**
 * fetch telegram updates (polling mode)
 * @param {boolean} get true when getting messages, false when sending replies
 * @param {string} url url query string
 * @returns {Promise<Array|void>} update obj from API (arr of users info, msgs etc) when getting messages | void when sending replies
 */
const getUpdates = async (get, url) => {

    const responseAPI = await fetch(url);

    if (!responseAPI.ok) {          
        throw new TelegramAPIError(responseAPI.statusText);
    };

    if (get) {
        const {
            result
        } = await responseAPI.json();
        return result; 

    } else {
        return; 
    }
}

export default getUpdates;