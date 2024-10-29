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
  case NODE_ENV === 'test': {
    config = { enabled: false, name: 'Pino-Test' };
    transport = {};
    break;
  }
  case NODE_ENV === 'development' || NODE_ENV === undefined: {
    config = {
      level: process.env.PINO_LOG_LEVEL || 'trace',
      name: 'Pino-Dev',
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
      level: process.env.PINO_LOG_LEVEL_PROD || 'info',
      name: 'Pino-Prod',
      timestamp: pino.stdTimeFunctions.isoTime,
    };
    transport = pino.transport({
      targets: [
        {
          level: 'error',
          options: {
            collection: `logs-${YEAR}-${MONTH}-${DAY}`,
            database: process.env.MONGODB_DATABASE,
            mongoOptions: {
              auth: {
                password: process.env.MONGODB_PASSWORD,
                username: process.env.MONGODB_USER,
              },
            },
            uri: `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_HOST}/`,
          },
          target: 'pino-mongodb',
        },
      ],
    });
    break;
  }
}

export default pino(config, transport);
