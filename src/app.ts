// import logError from './tools/logError.js';
import 'dotenv/config';

import initServer from './initServer';

initServer();
// /**
//  * app entry point (webhook mode)
//  */
// import server from './bot/server.js';
// (async () => {
//     await server().catch(err => {
//         logError(err);
//     })
// })()

/**
 * app entry point (polling mode)
 */

// import handleUpdatesPolling from './src/bot/handleUpdatesPolling.js'; //uncomment this if 'polling' mode is preferable
// (async () => {
//     while (true) {
//         await handleUpdatesPolling().catch(err => {
//             logError(err);
//         });
//         await new Promise(resolve => setTimeout(resolve, 5000));
//     }

// })()
