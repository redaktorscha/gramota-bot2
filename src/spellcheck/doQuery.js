const { GramotaRuError } = require('../tools/customErrors');
require('dotenv').config();
const childProcess = require('child_process');
const logError = require('../tools/logError');

const doQuery = async (word) => {

    const URL = `${process.env.GRAMOTA_URL}${word}`;
    
    return new Promise((resolve, reject) => {

        childProcess.exec(`curl ${URL} | iconv -f windows-1251 -t utf-8`, (error, stdout) => { 
            if (error) {
                console.log('exec error: ' + error);
                logError(new GramotaRuError(error.message));
                reject(error);
            }

            resolve(stdout);

        });
    });
}

module.exports = doQuery;