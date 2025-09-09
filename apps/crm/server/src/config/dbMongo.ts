import { MongoClient, type TopologyEvents } from 'mongodb';

import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';

import fs from 'node:fs';
import { createSecureContext } from 'node:tls';

const { MONGO_ARGS, MONGO_DATABASE, MONGO_DOCKER_PORT, MONGO_HOST, MONGO_PASSWORD, MONGO_PROTOCOL, MONGO_USER } =
  process.env;

const MONGO_URI = `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_DOCKER_PORT}/${MONGO_DATABASE}${MONGO_ARGS}`;

// DANGER:  Ensure logger for current ENV is not storing credentials; level INFO or higher.
pinoLogger.debug(MONGO_URI);

let secureContext;
try {
  secureContext = createSecureContext({
    ca: fs.readFileSync('/etc/expressjs/certs/expressjs-ca.crt'),
    cert: fs.readFileSync('/etc/expressjs/certs/expressjs-mongo.crt'),
    key: fs.readFileSync('/etc/expressjs/certs/expressjs-mongo.key'),
  });
  console.log('[dbMongo] Secure context created');
} catch (error) {
  console.error('[dbMongo] Failed to create secure context:', error);
}

const mongoClient = new MongoClient(MONGO_URI, {
  rejectUnauthorized: true,
  secureContext,
  tls: true,
});

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
        pinoLogger.info(`${event}: MongoDB: @${MONGO_HOST}:${MONGO_DOCKER_PORT}/${MONGO_DATABASE}`);
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

export { connectMongoDB, mongoClient, mongoDB };
