//@ts-check

import express, { Request, Response, NextFunction } from 'express';
import { writeFile } from 'node:fs/promises';
import iconv from 'iconv-lite';
import { createReadStream } from 'node:fs';

const STATUS_CODES = {
  ok: 200,
  errorServer: 500,
  notFound: 404,
  accessDenied: 403,
};

const RESPONSE_CONTENT_TYPE = 'text/html; charset=utf-8';
const PORT = Number(process.env.PORT) || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_ROUTE = `/${BOT_TOKEN}/`;

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(STATUS_CODES.errorServer)
    .send(`Oops, something went wrong! ${error.message}`);
};

const initServer = () => {
  const app = express();

  app
    .use(express.json())

    .get('/test/', (_, res: Response) => {
      res
        .status(STATUS_CODES.ok)
        .set({
          'Content-Type': RESPONSE_CONTENT_TYPE,
        })
        .send('<h1>Server up!<h1>');
    })

    .post(SECRET_ROUTE, async (req: Request, res: Response) => {
      const { message } = req.body;
      if (message) {
        console.log('got new message: ', message);
        const queryUrl = `${process.env.DICT_URI}${message}`;
        const response = await fetch(queryUrl);
        if (!response.ok) {
          console.log('Gramota Error');
        } else {
          response
            .arrayBuffer()
            .then((arrayBuffer) =>
              iconv.decode(Buffer.from(arrayBuffer), 'win1251').toString()
            )
            .then((convertedString) => {
              const substr = 'style="padding-left:50px">';
              const closingTag = '</div';
              const targetIndex = convertedString.indexOf(substr);
              const cutIndexLeft = targetIndex + substr.length;

              let queryResult = convertedString.slice(cutIndexLeft);
              const cutIndexRight = queryResult.indexOf(closingTag);
              queryResult = queryResult.slice(0, cutIndexRight);
              console.log('queryResult', queryResult);
              writeFile('./gramota-cut', queryResult);
            });
          // const substr = 'style="padding-left:50px">';
          // const closingTag = '</div';
          // const targetIndex = queryResult.indexOf(substr);
          // const cutIndexLeft = targetIndex + substr.length;
          // const cutIndexRight = queryResult.indexOf(closingTag);
          // queryResult = queryResult.slice(cutIndexLeft).slice(0, cutIndexRight);
          // console.log('queryResult', queryResult);
          // const buffer = iconv.encode(queryResult, 'win1251');
          // const decodedString = iconv.decode(buffer, 'utf8');
          // console.log('decodedString', decodedString);
          //writeFileSync('./gramota-res', queryResult);
        }
      }

      res
        .status(STATUS_CODES.ok)
        .set({
          'Content-Type': RESPONSE_CONTENT_TYPE,
        })
        .send('ok');
    })

    .all(/./, (_, res: Response) => {
      res
        .status(STATUS_CODES.notFound)
        .set({
          'Content-Type': RESPONSE_CONTENT_TYPE,
        })
        .send('Nothing here...');
    })
    .use(errorHandler);

  app.listen(PORT, () =>
    console.log(`Listening at port ${PORT}, Process: ${process.pid}`)
  );
};

export default initServer;
