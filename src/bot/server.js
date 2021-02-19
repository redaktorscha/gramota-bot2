/**
 * @module src/bot/server
 */

const https = require('https'); //module server.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const log = require('../tools/log');
const handleUpdatesWebhook = require('./handleUpdatesWebhook');


const {
    TelegramAPIError
} = require('../tools/customErrors');

const logError = require('../tools/logError');


/**
 * node https server
 * @returns {Promise<void>}
 */
const server = async () => {
    
    /**
     * @param {string} fileName
     * @returns {string} - path to SSL key or certificate
     */
    const pathToPem = (fileName) => path.join(__dirname, '..', '/..', fileName);

    const options = {
        key: fs.readFileSync(pathToPem('webhook_pkey.key')),
        cert: fs.readFileSync(pathToPem('webhook_cert.pem'))
    };
    const servHTTPS = https.createServer(options, (request, response) => {

        const url = request.url;

        request.on('error', err => {
            response.statusCode = 400;
            logError(err);
            response.end('400: Bad Request');
            return;
        });

        response.on('error', err => {
            logError(err);
            return;
        });

        if (request.method == 'POST') { //POST from Telegram
            const contentType = request.headers['content-type'];

            if (url === `/${process.env.BOT_TOKEN}` && contentType.includes('application/json')) { //'secret path' for getting telegram updates
                log(server.name, 'POST from Telegram API');

                let body = [];//const
                request.on('data', chunk => {
                    body.push(chunk);
                });
                request.on('end', async () => {
                    try {
                        const parsedBody = JSON.parse(body.join(''));
                        response.writeHead(200);
                        response.end();
                        const newMsgs = Object.keys(parsedBody).length;
                        if (newMsgs) {
                            log(server.name, `got ${newMsgs} new updates`);
                            await handleUpdatesWebhook(parsedBody).catch(err => {
                                throw new TelegramAPIError(err)
                            });
                        } else {
                            log(server.name, 'no new msgs, check your webhook');
                            return;
                        }

                    } catch (err) {
                        logError(error);
                    }
                })
            } else {
                response.statusCode = 400;
                response.end('400: Bad Request');
                return;
            }
        }

        if (request.method == 'GET') { //just to test if server is working
            log(server.name, 'GET');
            const html = `
            <html>
                <body>
                    <h2>https://localhost:3000</h2>
                </body>
            </html>`;
            response.writeHead(200, {
                'Content-Type': 'text/html'
            })
            response.end(html);
        }
    });

    const port = process.env.PORT;
    const host = process.env.SERVERIP;
    servHTTPS.listen(port, host);
    log(server.name, `Listening at http://${host}:${port}`);
}


module.exports = server;