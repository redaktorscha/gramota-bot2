/**
 * @module src/bot/server
 */

import https from 'https';
import fs from 'fs';
import getPath from '../tools/getPath.js';
import log from '../tools/log';
import handleUpdatesWebhook from './handleUpdatesWebhook.js';
import dotenv from 'dotenv';
dotenv.config({
    path: '../../.env'
});

import {
    TelegramAPIError
} from '../tools/customErrors.js';

import logError from '../tools/logError.js';


/**
 * node https server
 * @returns {Promise<void>}
 */
const server = async () => {   

    const options = {
        key: fs.readFileSync(getPath('webhook_pkey.key')),
        cert: fs.readFileSync(getPath('webhook_cert.pem'))
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

                let body = []; //const
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


export default server;