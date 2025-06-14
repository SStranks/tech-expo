import type { LoggerOptions } from 'pino';

import { pino as pinoLib } from 'pino';
// NOTE:  Rebinding pino due to library v9.6 exports error
const pino = pinoLib;

// NOTE:  Logger levels: trace, debug, info, warn, error, and fatal.

const NODE_ENV = process.env.NODE_ENV;
const DATE = new Date();
const YEAR = DATE.getFullYear();
const MONTH = DATE.toLocaleString('default', { month: 'short' });
const DAY = DATE.getDate();

let config: LoggerOptions = {};
let transport;

switch (true) {
  case NODE_ENV === 'test': {
    config = { name: 'Pino-Test', enabled: false };
    transport = {};
    break;
  }
  case NODE_ENV === 'development' || NODE_ENV === undefined: {
    config = {
      name: 'Pino-Dev',
      level: process.env.PINO_LOG_LEVEL || 'trace',
      timestamp: pino.stdTimeFunctions.isoTime,
    };
    transport = pino.transport({
      targets: [
        // {
        //   target: 'pino-mongodb',
        //   level: 'info',
        //   options: {
        //     uri: `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_HOST}/`,
        //     database: process.env.MONGO_DATABASE,
        //     collection: `logs-${YEAR}-${MONTH}-${DAY}`,
        //     mongoOptions: {
        //       auth: {
        //         username: process.env.MONGO_USER,
        //         password: process.env.MONGO_PASSWORD,
        //       },
        //     },
        //   },
        // },
        {
          level: 'trace',
          options: { colorize: true },
          target: 'pino-pretty',
        },
      ],
    });
    break;
  }
  case NODE_ENV === 'production': {
    config = {
      name: 'Pino-Prod',
      level: process.env.PINO_LOG_LEVEL_PROD || 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
    };
    transport = pino.transport({
      targets: [
        {
          level: 'error',
          target: 'pino-mongodb',
          options: {
            collection: `logs-${YEAR}-${MONTH}-${DAY}`,
            database: process.env.MONGO_DATABASE,
            uri: `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_HOST}/`,
            mongoOptions: {
              auth: {
                password: process.env.MONGO_PASSWORD,
                username: process.env.MONGO_USER,
              },
            },
          },
        },
      ],
    });
    break;
  }
}

export default pino(config, transport);
