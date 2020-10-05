
const handleUpdates = require('./handleUpdates');

//handleUpdates('polling');





(async () => {
    while (true) {
        await handleUpdates('polling').catch(err => {
            console.log(err);
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

})()
