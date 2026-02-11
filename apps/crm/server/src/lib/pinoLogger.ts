import pino, { type Logger } from 'pino';

import { env } from '#Config/env.js';
import { secrets } from '#Config/secrets.js';

const { MONGO_DATABASE, MONGO_PASSWORD_SERVICE, MONGO_USER_SERVICE } = secrets;
const { MONGO_HOST, MONGO_PROTOCOL, NODE_ENV, PINO_LOG_LEVEL } = env;

// NOTE:  Logger levels: trace (10), debug (20), info (30), warn (40), error (50), and fatal (60).

const mongoDefaults = {
  target: 'pino-mongodb',
  options: {
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
};

const pinoPrettyTransport = {
  level: 'trace',
  options: { colorize: true },
  target: 'pino-pretty',
};

const serverLoggerTargets: pino.TransportTargetOptions[] = [
  {
    ...mongoDefaults,
    options: { ...mongoDefaults.options, collection: `logs-expressjs-${NODE_ENV}-server` },
  },
];

if (NODE_ENV === 'development') serverLoggerTargets.push(pinoPrettyTransport);

const serverLogger: Logger = pino({
  name: `Pino-${NODE_ENV}-ServerLogger`,
  level: PINO_LOG_LEVEL || (NODE_ENV === 'development' ? 'trace' : 'info'),
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: { targets: serverLoggerTargets },
});

const securityLoggerTargets: pino.TransportTargetOptions[] = [
  {
    ...mongoDefaults,
    options: { ...mongoDefaults.options, collection: `logs-expressjs-${NODE_ENV}-security` },
  },
];

if (NODE_ENV === 'development') securityLoggerTargets.push(pinoPrettyTransport);

const securityLogger: Logger = pino({
  name: `Pino-${NODE_ENV}-securityLogger`,
  level: PINO_LOG_LEVEL || (NODE_ENV === 'development' ? 'trace' : 'info'),
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: { targets: securityLoggerTargets },
});

const appLoggerTargets: pino.TransportTargetOptions[] = [
  {
    ...mongoDefaults,
    options: { ...mongoDefaults.options, collection: `logs-expressjs-${NODE_ENV}-app` },
  },
];

if (NODE_ENV === 'development') appLoggerTargets.push(pinoPrettyTransport);

const appLogger: Logger = pino({
  name: `Pino-${NODE_ENV}-appLogger`,
  level: PINO_LOG_LEVEL || (NODE_ENV === 'development' ? 'trace' : 'info'),
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: { targets: appLoggerTargets },
});

const crashLogger = pino(
  {
    name: `Pino-${NODE_ENV}-crashLogger`,
    level: 'fatal',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination(1)
);

const pinoLogger = { app: appLogger, crash: crashLogger, security: securityLogger, server: serverLogger };

export default pinoLogger;
