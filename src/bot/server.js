const http = require('http'); //module server.js
//const handleUpdates = require('./src/bot/handleUpdates');
//$ npm install --save body-parser
// const bodyParser = require('body-parser');
// const {result} = bodyParser.json() //
const {
    TelegramAPIError
} = require('../tools/customErrors');

const logError = require('../tools/logError');

const server = async () => {
    const servHTTP = http.createServer((request, response) => {

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

        if (request.method == 'POST') {
            if (url === '/mysecretpath') { //bot token here
                console.log('POST from Telegram API');
                let body = '';
                request.on('data', chunk => {
                    body += chunk;
                });
                request.on('end', () => {
                    console.log('Body: ' + body);
                    response.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    response.end();
                    if (!body) {
                        throw new TelegramAPIError('no body');
                    }
                    return body;
                })
            } else {
                response.statusCode = 400;
                response.end('400: Bad Request');
                return;
            }

        } else if (request.method == 'GET') {
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
        } else {
            response.statusCode = 400;
            response.end('400: Bad Request');
            return;
        }
    });

    const port = 3000;
    const host = '192.168.1.48';
    servHTTP.listen(port, host);
    console.log(`Listening at http://${host}:${port}`);
}


module.exports = server;