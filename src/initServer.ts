import express, { Request, Response, NextFunction } from 'express';
import { regexps } from './utils/regexps';
import iconv from 'iconv-lite';
import botReplies from './textResources.json';
import parse from './parser';

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number, name: string) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

type BotCommandType = 'start' | 'help' | 'info';

//todo: different dictionaries support
enum Dictionaries {
  Orthography = 'lop',
  Explanatory = 'bts',
  Orthoepy = 'zar',
}

import type {
  Update,
  Message,
  Sticker,
  User,
  MessageEntity,
} from 'telegram-typings';

const STATUS_CODES = {
  ok: 200,
  errorServer: 500,
  notFound: 404,
};

const RESPONSE_CONTENT_TYPE = 'text/html; charset=utf-8';
const PORT = Number(process.env.PORT) || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const DICT_URI = process.env.DICT_URI || '';
const SECRET_ROUTE = `/${BOT_TOKEN}/`;
const TEST_ROUTE = `/test/`;
const TEST_RESPONSE = '<h1>Server up!<h1>';
const NOT_FOUND_RESPONSE = 'Nothing here...';
const TARGET_ENCODING = 'win1251';
const MAX_QUERY_LENGTH = 50;
const MAX_FETCH_RETRIES = 2;
const GRAMOTA_ERROR = 'GramotaError';
const NETWORK_ERROR = 'NetworkError';
const UNKNOWN_ERROR = 'Something went wrong';

// move to src/middleware
const errorHandler = (
  error: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error); // log error.stack
  const code =
    error instanceof CustomError ? error.statusCode : STATUS_CODES.errorServer;
  handleQuery(res, code, error.message ?? UNKNOWN_ERROR); // log
};

const testRouteHandler = (req: Request, res: Response) => {
  res
    .status(STATUS_CODES.ok)
    .set({
      'Content-Type': RESPONSE_CONTENT_TYPE,
    })
    .send(TEST_RESPONSE);
};

const defaultRouteHandler = (req: Request, res: Response) => {
  res
    .status(STATUS_CODES.notFound)
    .set({
      'Content-Type': RESPONSE_CONTENT_TYPE,
    })
    .send(NOT_FOUND_RESPONSE);
};

interface IFetchFunc {
  (arg: string): Promise<ArrayBuffer>;
}

const retry = (func: IFetchFunc, delay: number, maxRetries: number) => {
  return function _retried(arg: string): Promise<ArrayBuffer> {
    let retries = 0;
    return new Promise((resolve, reject) => {
      const setTimer = () => {
        setTimeout(() => {
          retries += 1;
          console.log('retries', retries);
          func(arg)
            .then((result) => resolve(result))
            .catch((error: Error) => {
              console.error(error); // logging
              if (retries === maxRetries) {
                console.log('rejected');
                reject(error);
              } else {
                setTimer();
              }
            });
        }, delay);
      };
      func(arg)
        .then((result) => resolve(result))
        .catch((error: Error) => {
          console.error('first time error', error); // logging
          setTimer();
        });
    });
  };
};

const handleQuery = (response: Response, status: number, reply: string) => {
  response
    .status(status)
    .set({
      'Content-Type': RESPONSE_CONTENT_TYPE,
    })
    .send(reply);
};

const isBot = (user: User | undefined) => user && user.is_bot;

const isCommand = (message: string) => message.startsWith('/');

const isSupportedCommand = (command: string): command is BotCommandType =>
  ['start', 'info', 'help'].includes(command);

const normalizeQuery = (query: string) => query.trim().toLowerCase();

/**
 * the query should consist of cyrillic chars only, max length to avoid spam queries,
 * '*' and '?'/'???" are valid, 3 '?' is valid but 3 '*' and asterisks only aren't valid
 */
const isValidQuery = (query: string) => {
  const { onlyAsteriks, allowedChars } = regexps;
  return (
    !new RegExp(onlyAsteriks).test(query) &&
    new RegExp(allowedChars).test(query) &&
    query.length <= MAX_QUERY_LENGTH
  );
};

const getReplyToCommand = (
  userName: string,
  botCommand: BotCommandType | string
) => {
  if (!isSupportedCommand(botCommand)) {
    return botReplies.unsupported_command;
  }
  if (botCommand === 'start') {
    return `${botReplies.greet}, ${userName}!\n${botReplies.start}`;
  } else {
    return botReplies[botCommand];
  }
};

const getReplyToSticker = () => botReplies.sticker;

const getReplyToEmpty = () => botReplies.empty;

const getReplyToQueryWord = (word: string) => {
  const queryUri = getQueryUri(DICT_URI, word);
  console.log('queryUri', queryUri);
  return fetchWithRetry(queryUri)
    .then((arrayBuffer) =>
      decodeFetchResults(Buffer.from(arrayBuffer), TARGET_ENCODING)
    )
    .then((convertedString) => {
      return parse(convertedString);
    });
};

const getQueryUri = (
  dictUri: string,
  queryString: string,
  dict = Dictionaries.Orthography
) => `${dictUri}${queryString}&${dict}=x`;

const decodeFetchResults = (buffer: Buffer, encodingType: string) =>
  iconv.decode(buffer, encodingType).toString();

const fetchBufferedResults = async (uri: string) => {
  return fetch(uri)
    .catch((_) =>
      Promise.reject(
        new CustomError(botReplies.error_bot, STATUS_CODES.ok, NETWORK_ERROR)
      )
    ) // log
    .then((response) => {
      console.log('response status: ', response.status);
      if (!response.ok) {
        return Promise.reject(
          new CustomError(botReplies.error_dict, STATUS_CODES.ok, GRAMOTA_ERROR)
        ); // log
      }
      return response.arrayBuffer();
    });
};

const fetchWithRetry = retry(fetchBufferedResults, 1000, MAX_FETCH_RETRIES);

const webhookRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message }: Update = req.body;
  if (!message || isBot(message.from)) {
    handleQuery(res, STATUS_CODES.ok, botReplies.unsupported_query);
    return;
  }
  console.log('got new message: ', message);

  const { from, date, text, sticker } = message; //todo: date logging

  const username = from?.first_name ?? botReplies.default_username;

  if (sticker) {
    handleQuery(res, STATUS_CODES.ok, getReplyToSticker());
    return;
  }

  if (text && isCommand(text)) {
    handleQuery(
      res,
      STATUS_CODES.ok,
      getReplyToCommand(username, text.slice(1))
    ); //slice '/'
    return;
  }

  if (!text || text.trim().length === 0) {
    handleQuery(res, STATUS_CODES.ok, getReplyToEmpty());
    return;
  }

  const normalizedQueryWord = normalizeQuery(text);

  if (!isValidQuery(normalizedQueryWord)) {
    handleQuery(res, STATUS_CODES.ok, botReplies.unsupported_query);
    return;
  }

  getReplyToQueryWord(normalizedQueryWord)
    .then((result) => handleQuery(res, STATUS_CODES.ok, result))
    .catch((err: Error) => {
      next(err);
    });
};

const initServer = () => {
  const app = express();

  app
    .use(express.json())

    .get(TEST_ROUTE, testRouteHandler)

    .post(SECRET_ROUTE, webhookRouteHandler)

    .all(/./, defaultRouteHandler)

    .use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}, Process: ${process.pid}`);
    // await setWebhook
  });
};

export default initServer;
