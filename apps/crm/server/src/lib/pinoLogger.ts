import type { LoggerOptions } from 'pino';

import pino from 'pino';

import { secrets } from '#Config/secrets.js';

const { MONGO_DATABASE, MONGO_PASSWORD_SERVICE, MONGO_USER_SERVICE } = secrets;
const { MONGO_HOST, MONGO_PROTOCOL, NODE_ENV, PINO_LOG_LEVEL, PINO_LOG_LEVEL_PROD } = process.env;

// NOTE:  Logger levels: trace, debug, info, warn, error, and fatal.
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
      level: PINO_LOG_LEVEL || 'trace',
      timestamp: pino.stdTimeFunctions.isoTime,
    };
    transport = pino.transport({
      targets: [
        {
          level: 'info',
          target: 'pino-mongodb',
          options: {
            collection: 'logs-expressjs-dev',
            database: MONGO_DATABASE,
            uri: `${MONGO_PROTOCOL}://${MONGO_HOST}/`,
            mongoOptions: {
              tls: true,
              tlsCAFile: '/etc/expressjs/certs/expressjs-ca.crt',
              tlsCertificateKeyFile: '/etc/expressjs/certs/expressjs-mongo.pem',
              auth: {
                password: MONGO_PASSWORD_SERVICE,
                username: MONGO_USER_SERVICE,
              },
            },
          },
        },
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
      level: PINO_LOG_LEVEL_PROD || 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
    };
    transport = pino.transport({
      targets: [
        {
          level: 'error',
          target: 'pino-mongodb',
          options: {
            collection: 'logs-expressjs-prod',
            database: MONGO_DATABASE,
            uri: `${MONGO_PROTOCOL}://${MONGO_HOST}/`,
            mongoOptions: {
              tls: true,
              tlsCAFile: '/etc/expressjs/certs/expressjs-ca.crt',
              tlsCertificateKeyFile: '/etc/expressjs/certs/expressjs-mongo.pem',
              auth: {
                password: MONGO_PASSWORD_SERVICE,
                username: MONGO_USER_SERVICE,
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
