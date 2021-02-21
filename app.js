import logError from './src/tools/logError.js';
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});


/**
 * app entry point (webhook mode)
 */
//import server from './src/bot/server.js';
// (async () => {
//     await server().catch(err => {
//         logError(err);
//     })
// })()






/**
 * app entry point (polling mode)
 */

import handleUpdatesPolling from './src/bot/handleUpdatesPolling.js'; //uncomment this if 'polling' mode is preferable
(async () => {
    while (true) {
        await handleUpdatesPolling().catch(err => {
            logError(err);
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

})()