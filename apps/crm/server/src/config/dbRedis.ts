import { createClient } from 'redis';

import { pinoLogger, rollbar } from '#Lib/index.js';

import fs from 'node:fs';
import { createSecureContext } from 'node:tls';

const { NODE_ENV, REDIS_DOCKER_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_USERNAME } = process.env;
const REDIS_URL = `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_DOCKER_PORT}`;

let secureContext;
try {
  secureContext = createSecureContext({
    cert: fs.readFileSync('/etc/expressjs/certs/expressjs-redis.crt'),
    key: fs.readFileSync('/etc/expressjs/certs/expressjs-redis.key'),
    ca:
      NODE_ENV === 'development'
        ? fs.readFileSync('/etc/expressjs/certs/expressjs-ca.crt')
        : fs.readFileSync('/etc/expressjs/certs/redis-ca.crt'),
  });
  console.log('[dbRedis] Secure context created');
} catch (error) {
  console.error('[dbRedis] Failed to create secure context:', error);
}

const redisClient = createClient({
  // url: `${REDIS_URL}`,
  socket: {
    host: `${REDIS_HOST}`,
    port: Number(`${REDIS_DOCKER_PORT}`),
    rejectUnauthorized: true,
    secureContext,
    tls: true,
  },
});

// DANGER:  Ensure logger for current ENV is not storing credentials; level INFO or higher.
pinoLogger.debug(REDIS_URL);

type RedisEvents = 'connect' | 'ready' | 'end' | 'error' | 'reconnecting';
type TRedisServerEvents = {
  [K in RedisEvents]?: boolean;
};

class ServerEventsLogger {
  private RedisClient;
  private eventNames;

  constructor(RedisClient: typeof redisClient, eventName: TRedisServerEvents) {
    this.RedisClient = RedisClient;
    this.eventNames = eventName;

    Object.keys(this.eventNames).forEach((event) => {
      this.RedisClient.on(event, () => {
        pinoLogger.info(`${event}: RedisDB: @${REDIS_HOST}:${REDIS_DOCKER_PORT}`);
      });
    });
  }
}

// NOTE:  Redis requires at least 1 eventEmitter to be listened to
new ServerEventsLogger(redisClient, {
  connect: true,
  end: true,
  error: true,
  ready: true,
  reconnecting: true,
});

// Connection
const connectRedisDB = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    const errMsg = `Cannot connect to Redis: ${REDIS_HOST}:${REDIS_DOCKER_PORT}`;
    process.exitCode = 1;

    pinoLogger.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
  pinoLogger.info(`Connected to Redis: ${REDIS_HOST}:${REDIS_DOCKER_PORT}`);
};

export { connectRedisDB, redisClient };
