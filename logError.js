const logError = (error) => {
    const fs = require('fs');
    const date = new Date().toLocaleString();

    fs.appendFileSync('./error-log', `${date}:${error}\n`);
}

module.exports = logError;