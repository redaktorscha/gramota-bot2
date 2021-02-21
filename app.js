import logError from './src/tools/logError.js';
import server from './src/bot/server.js';
/**
 * app entry point (webhook mode)
 */
(async () => {
    await server().catch(err => {
        logError(err);
    })
})()






/**
 * app entry point (polling mode)
 */

// import handleUpdatesPolling from './src/bot/handleUpdatesPolling.js'); //uncomment this if 'polling' mode is preferable
// (async () => {
//     while (true) {
//         await handleUpdatesPolling().catch(err => {
//             logError(err);
//         });
//         await new Promise(resolve => setTimeout(resolve, 5000));
//     }

// })()