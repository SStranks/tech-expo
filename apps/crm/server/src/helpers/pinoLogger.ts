import pino, { type LoggerOptions } from 'pino';

// NOTE:  Logger levels: trace, debug, info, warn, error, and fatal.

const NODE_ENV = process.env.NODE_ENV;
const DATE = new Date();
const YEAR = DATE.getFullYear();
const MONTH = DATE.toLocaleString('default', { month: 'short' });
const DAY = DATE.getDate();

let config: LoggerOptions = {};
let transport;

switch (true) {
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
        //     uri: `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_HOST}/`,
        //     database: process.env.MONGODB_DATABASE,
        //     collection: `logs-${YEAR}-${MONTH}-${DAY}`,
        //     mongoOptions: {
        //       auth: {
        //         username: process.env.MONGODB_USER,
        //         password: process.env.MONGODB_PASSWORD,
        //       },
        //     },
        //   },
        // },
        {
          target: 'pino-pretty',
          level: 'trace',
          options: { colorize: true },
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
          target: 'pino-mongodb',
          level: 'error',
          options: {
            uri: `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_HOST}/`,
            database: process.env.MONGODB_DATABASE,
            collection: `logs-${YEAR}-${MONTH}-${DAY}`,
            mongoOptions: {
              auth: {
                username: process.env.MONGODB_USER,
                password: process.env.MONGODB_PASSWORD,
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
