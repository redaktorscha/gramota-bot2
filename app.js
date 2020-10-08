//const handleUpdatesPolling = require('./src/bot/handleUpdatesPolling'); //if 'polling' method
// (async () => {
//     while (true) {
//         await handleUpdatesPolling().catch(err => {
//             console.log(err);
//         });
//         await new Promise(resolve => setTimeout(resolve, 5000));
//     }

// })()



const logError = require('./src/tools/logError');
const server = require('./src/bot/server');

(async () => {
    await server().catch(err => {
        console.log(err);
        logError(err);
    })
})()