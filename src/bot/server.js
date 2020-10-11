const https = require('https'); //module server.js
require('dotenv').config();
fs = require('fs');
const path = require('path');
const handleUpdatesWebhook = require('./handleUpdatesWebhook');

// https.createServer(options, function (req, res) {
const {
    TelegramAPIError
} = require('../tools/customErrors');

const logError = require('../tools/logError');

const server = async () => {
    /**
     * 
     * @param {string} fileName 
     */
    const pathToPem = (fileName) => path.join(__dirname, '..', '/..', fileName);

    const options = {
        key: fs.readFileSync(pathToPem('webhook_pkey.key')),
        cert: fs.readFileSync(pathToPem('webhook_cert.pem'))
    };
    const servHTTPS = https.createServer(options, (request, response) => {

        const url = request.url;

        request.on('error', err => {
            console.log(err);
            response.statusCode = 400;
            logError(err);
            response.end('400: Bad Request');
            return;
        });

        response.on('error', err => {
            console.log(err);
            return;
        });

        if (request.method == 'POST') { //POST from Telegram
            const contentType = request.headers['content-type'];

            if (url === `/${process.env.BOT_TOKEN}` && contentType.includes('application/json')) { //bot token here //&& contentType.includes('application/json')
                console.log('POST from Telegram API');

                let body = [];
                request.on('data', chunk => {
                    body.push(chunk);
                });
                request.on('end', async () => {
                    //console.log('body: ' + body.toString());
                    try {
                        const parsedBody = JSON.parse(body.join(''));
                        //console.log('body parsed: ', parsedBody);
                        response.writeHead(200);
                        response.end();
                        const newMsgs = Object.keys(parsedBody).length;
                        if (newMsgs) {
                            console.log(`got ${newMsgs} new updates`);
                            await handleUpdatesWebhook(parsedBody).catch(err => {
                                throw new TelegramAPIError(err)
                            });
                        } else {
                            console.log('no new msgs, check your webhook');
                            return;
                        }

                    } catch (err) {
                        console.log(error);
                        logError(error);
                    }
                })
            } else {
                response.statusCode = 400;
                response.end('400: Bad Request');
                return;
            }
        }

        if (request.method == 'GET') {
            console.log('GET');
            const html = `
            <html>
                <body>
                    <h2>http://localhost:3000</h2>
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
    console.log(`Listening at http://${host}:${port}`);
}


module.exports = server;