import { MongoClient, type TopologyEvents } from 'mongodb';

import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';

const { MONGO_ARGS, MONGO_DATABASE, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_PROTOCOL, MONGO_USER } = process.env;

const MONGO_URI = `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}${MONGO_ARGS}`;

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
        pinoLogger.info(`${event}: MongoDB: @${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);
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
    const errMsg = `Cannot connect to Mongo: ${MONGO_DATABASE} @ ${MONGO_HOST}`;
    process.exitCode = 1;

    pinoLogger.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
};

const mongoDB = mongoClient.db(`${MONGO_DATABASE}`);

export { mongoDB, connectMongoDB, mongoClient };
