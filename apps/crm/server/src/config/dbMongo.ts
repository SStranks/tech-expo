import { MongoClient } from 'mongodb';
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

// mongoClient.on('serverHeartbeatStarted', () => {
//   pinoLogger.info(`serverHeartbeatStarted: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
// });

// mongoClient.on('serverHeartbeatSucceeded', () => {
//   pinoLogger.info(`serverHeartbeatSucceeded: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
// });

// mongoClient.on('serverHeartbeatFailed', () => {
//   pinoLogger.info(`serverHeartbeatFailed: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
// });

mongoClient.on('serverOpening', () => {
  pinoLogger.info(`serverOpening: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('serverClosed', () => {
  pinoLogger.info(`serverClosed: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('topologyOpening', () => {
  pinoLogger.info(`topologyOpening: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('topologyClosed', () => {
  pinoLogger.info(`topologyClosed: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionPoolCreated', () => {
  pinoLogger.info(`connectionPoolCreated: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionPoolReady', () => {
  pinoLogger.info(`connectionPoolReady: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionPoolClosed', () => {
  pinoLogger.info(`connectionPoolClosed: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionReady', () => {
  pinoLogger.info(`connectionReady: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionClosed', () => {
  pinoLogger.info(`connectionClosed: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionCheckOutStarted', () => {
  pinoLogger.info(`connectionCheckOutStarted: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionCheckOutFailed', () => {
  pinoLogger.info(`connectionCheckOutFailed: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionCheckedOut', () => {
  pinoLogger.info(`connectionCheckedOut: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionCheckedIn', () => {
  pinoLogger.info(`connectionCheckedIn: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

mongoClient.on('connectionPoolCleared', () => {
  pinoLogger.info(`connectionPoolCleared: MongoDB: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`);
});

const connectMongoDB = async () => {
  try {
    await mongoClient.connect();
  } catch (error) {
    process.exitCode = 1;
    const errMsg = `Cannot connect to database: ${MONGODB_DATABASE} @ ${MONGODB_HOST}`;
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

export { connectMongoDB, disconnectMongoDB };
