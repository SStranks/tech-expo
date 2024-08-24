import { MongoClient } from 'mongodb';
import pinoLogger from '#Helpers/pinoLogger';
import rollbar from '#Helpers/rollbar';

const { DB_MONGO_PROTOCOL, DB_MONGO_USER, DB_MONGO_PASSWORD, DB_MONGO_HOST, DB_MONGO_DATABASE, DB_MONGO_ARGS } =
  process.env;

const MONGO_URI = `${DB_MONGO_PROTOCOL}://${DB_MONGO_USER}:${DB_MONGO_PASSWORD}@${DB_MONGO_HOST}/${DB_MONGO_DATABASE}${DB_MONGO_ARGS}`;
pinoLogger.debug(`*** ${MONGO_URI}`);
pinoLogger.debug(`*** ${DB_MONGO_PROTOCOL} *** ${DB_MONGO_HOST} *** ${DB_MONGO_DATABASE}`);

const mongoClient = new MongoClient(MONGO_URI);

mongoClient.on('serverHeartbeatStarted', () => {
  pinoLogger.info(`serverHeartbeatStarted: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('serverHeartbeatSucceeded', () => {
  pinoLogger.info(`serverHeartbeatSucceeded: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('serverHeartbeatFailed', () => {
  pinoLogger.info(`serverHeartbeatFailed: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('serverOpening', () => {
  pinoLogger.info(`serverOpening: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('serverClosed', () => {
  pinoLogger.info(`serverClosed: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('topologyOpening', () => {
  pinoLogger.info(`topologyOpening: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('topologyClosed', () => {
  pinoLogger.info(`topologyClosed: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionPoolCreated', () => {
  pinoLogger.info(`connectionPoolCreated: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionPoolReady', () => {
  pinoLogger.info(`connectionPoolReady: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionPoolClosed', () => {
  pinoLogger.info(`connectionPoolClosed: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionReady', () => {
  pinoLogger.info(`connectionReady: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionClosed', () => {
  pinoLogger.info(`connectionClosed: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionCheckOutStarted', () => {
  pinoLogger.info(`connectionCheckOutStarted: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionCheckOutFailed', () => {
  pinoLogger.info(`connectionCheckOutFailed: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionCheckedOut', () => {
  pinoLogger.info(`connectionCheckedOut: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionCheckedIn', () => {
  pinoLogger.info(`connectionCheckedIn: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

mongoClient.on('connectionPoolCleared', () => {
  pinoLogger.info(`connectionPoolCleared: MongoDB: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
});

// mongoClient.on('error', (error) => {
//   pinoLogger.error(error, `*** MongoDB database error for: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`);
// });

const connectMongoDB = async () => {
  try {
    await mongoClient.connect();
  } catch (error) {
    process.exitCode = 1;
    const errMsg = `Cannot connect to database: ${DB_MONGO_DATABASE} @ ${DB_MONGO_HOST}`;
    pinoLogger.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
};

export default connectMongoDB;
