//@ts-check

import express, { Request, Response, NextFunction } from 'express';

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

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
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

    .post(SECRET_ROUTE, (req: Request, res: Response) => {
      const { message } = req.body;
      if (message) {
        console.log('got new message: ', message); // here goes word check
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