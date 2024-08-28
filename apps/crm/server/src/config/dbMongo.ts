import { MongoClient, type TopologyEvents } from 'mongodb';
import pinoLogger from '#Helpers/pinoLogger';
import rollbar from '#Helpers/rollbar';

const { MONGODB_PROTOCOL, MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_ARGS } =
  process.env;

const MONGO_URI = `${MONGODB_PROTOCOL}://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}${MONGODB_ARGS}`;

const mongoDebug = {
  URI: MONGO_URI,
  protocol: MONGODB_PROTOCOL,
  user: MONGODB_USER,
  password: MONGODB_PASSWORD,
  host: MONGODB_HOST,
  port: MONGODB_PORT,
  database: MONGODB_DATABASE,
  args: MONGODB_ARGS,
};
// NOTE:  DANGER: Ensure logger for current ENV is not storing credentials; level INFO or higher.
pinoLogger.debug({ mongoDebug });

const mongoClient = new MongoClient(MONGO_URI);

type TMongoServerEvents = {
  // eslint-disable-next-line no-unused-vars
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
  serverOpening: true,
  serverClosed: true,
  connectionCreated: true,
  connectionClosed: true,
  error: true,
  timeout: true,
});

const connectMongoDB = async () => {
  try {
    await mongoClient.connect();
  } catch (error) {
    const errMsg = `Cannot connect to database: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`;
    process.exitCode = 1;

    pinoLogger.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
};

const disconnectMongoDB = async () => {
  await mongoClient.close();
};

const mongoDB = mongoClient.db(`${MONGODB_DATABASE}`);

export { mongoDB, connectMongoDB, disconnectMongoDB };
