import { MongoClient, type TopologyEvents } from 'mongodb';

import pinoLogger from '#Helpers/pinoLogger.js';
import rollbar from '#Helpers/rollbar.js';

const { MONGODB_ARGS, MONGODB_DATABASE, MONGODB_HOST, MONGODB_PASSWORD, MONGODB_PORT, MONGODB_PROTOCOL, MONGODB_USER } =
  process.env;

const MONGO_URI = `${MONGODB_PROTOCOL}://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}${MONGODB_ARGS}`;

// DANGER:  Ensure logger for current ENV is not storing credentials; level INFO or higher.
pinoLogger.debug(MONGO_URI);

const mongoClient = new MongoClient(MONGO_URI);

type TMongoServerEvents = {
  [Key in keyof TopologyEvents]?: boolean;
};

class ServerEventsLogger {
  private MongoClient;
  private eventNames;

  constructor(mongoClient: MongoClient, eventName: TMongoServerEvents) {
    this.MongoClient = mongoClient;
    this.eventNames = eventName;

    Object.keys(this.eventNames).forEach((event) => {
      this.MongoClient.on(event, () => {
        pinoLogger.info(`${event}: MongoDB: @${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`);
      });
    });
  }
}

new ServerEventsLogger(mongoClient, {
  connectionClosed: true,
  connectionCreated: true,
  error: true,
  serverClosed: true,
  serverOpening: true,
  timeout: true,
});

const connectMongoDB = async () => {
  try {
    await mongoClient.connect();
  } catch (error) {
    const errMsg = `Cannot connect to Mongo: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`;
    process.exitCode = 1;

    pinoLogger.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
};

const mongoDB = mongoClient.db(`${MONGODB_DATABASE}`);

export { mongoDB, connectMongoDB, mongoClient };
