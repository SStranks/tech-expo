import { createClient } from 'redis';
import { pinoLogger, rollbar } from '#Helpers/index';

const { REDIS_USERNAME, REDIS_PASSWORD, REDIS_LOCAL_PORT, REDIS_HOST } = process.env;
const REDIS_URL = `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_LOCAL_PORT}`;

const redisClient = createClient({
  url: `${REDIS_URL}`,
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
        pinoLogger.info(`${event}: RedisDB: @${REDIS_HOST}:${REDIS_LOCAL_PORT}`);
      });
    });
  }
}

// NOTE:  Redis requires at least 1 eventEmitter to be listened to
new ServerEventsLogger(redisClient, {
  connect: true,
  ready: true,
  end: true,
  error: true,
  reconnecting: true,
});

// Connection
const connectRedisDB = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    const errMsg = `Cannot connect to Redis: ${REDIS_HOST}:${REDIS_LOCAL_PORT}`;
    process.exitCode = 1;

    pinoLogger.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
  pinoLogger.info(`Connected to Redis: ${REDIS_HOST}:${REDIS_LOCAL_PORT}`);
};

export { redisClient, connectRedisDB };
