const logError = require('./src/tools/logError');
const server = require('./src/bot/server');
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

// const handleUpdatesPolling = require('./src/bot/handleUpdatesPolling'); //uncomment this if 'polling' mode is preferable
// (async () => {
//     while (true) {
//         await handleUpdatesPolling().catch(err => {
//             logError(err);
//         });
//         await new Promise(resolve => setTimeout(resolve, 5000));
//     }

// })()