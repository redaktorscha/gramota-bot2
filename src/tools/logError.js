const fs = require('fs');
const path = require('path');

const logError = (error) => {
    const pathToErrorLog = path.join(__dirname, '..', '..', 'error-log');
    const date = new Date().toLocaleString();
    fs.appendFileSync(pathToErrorLog, `${date}:${error}\n`);
}

module.exports = logError;