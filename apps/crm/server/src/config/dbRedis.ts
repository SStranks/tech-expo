import { createClient } from 'redis';

import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';

import fs from 'node:fs';
import { createSecureContext } from 'node:tls';

import { env } from './env.js';
import { secrets } from './secrets.js';

const { REDIS_PASSWORD, REDIS_USERNAME } = secrets;
const { REDIS_DOCKER_PORT, REDIS_HOST } = env;
const REDIS_URL = `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_DOCKER_PORT}`;

let secureContext;
try {
  secureContext = createSecureContext({
    ca: fs.readFileSync('/etc/expressjs/certs/expressjs-ca.crt'),
    cert: fs.readFileSync('/etc/expressjs/certs/expressjs-redis.crt'),
    key: fs.readFileSync('/etc/expressjs/certs/expressjs-redis.key'),
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
pinoLogger.server.debug(REDIS_URL);

type RedisEvents = 'connect' | 'ready' | 'end' | 'error' | 'reconnecting';
type RedisServerEvents = {
  [K in RedisEvents]?: boolean;
};

class ServerEventsLogger {
  private readonly RedisClient;
  private readonly eventNames;

  constructor(RedisClient: typeof redisClient, eventName: RedisServerEvents) {
    this.RedisClient = RedisClient;
    this.eventNames = eventName;

    Object.keys(this.eventNames).forEach((event) => {
      this.RedisClient.on(event, () => {
        pinoLogger.server.info(`${event}: RedisDB: @${REDIS_HOST}:${REDIS_DOCKER_PORT}`);
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

const connectRedisDB = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    const errMsg = `Cannot connect to Redis: ${REDIS_HOST}:${REDIS_DOCKER_PORT}`;
    process.exitCode = 1;

    pinoLogger.server.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
  pinoLogger.server.info(`Connected to Redis: ${REDIS_HOST}:${REDIS_DOCKER_PORT}`);
};

export type RedisClient = typeof redisClient;
export { connectRedisDB, redisClient };
