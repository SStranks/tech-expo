import pino, { type LoggerOptions } from 'pino';
import path from 'node:path';
import url from 'node:url';

// NOTE:  Logger levels: trace, debug, info, warn, error, and fatal.

const NODE_ENV = process.env.NODE_ENV;
const CUR = path.dirname(url.fileURLToPath(import.meta.url));

let config: LoggerOptions = {};
let transport;

switch (true) {
  case NODE_ENV === 'development' || NODE_ENV === undefined: {
    config = {
      name: 'Pino-Dev',
      level: process.env.PINO_LOG_LEVEL_DEV || 'trace',
      timestamp: pino.stdTimeFunctions.isoTime,
    };
    transport = pino.transport({
      targets: [
        {
          target: 'pino/file',
          options: {
            destination: `${path.resolve(CUR, '../log/app.dev.log')}`,
          },
        },
        {
          target: 'pino-pretty',
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
    };
    transport = pino.transport({
      target: 'pino/file',
      options: { destination: `${path.resolve(CUR, '../log/app.prod.log')}` },
    });
    break;
  }
}

export default pino(config, transport);
