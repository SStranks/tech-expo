import { MongoClient, type TopologyEvents } from 'mongodb';

import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';

import fs from 'node:fs';
import { createSecureContext } from 'node:tls';

import { env } from './env.js';
import { secrets } from './secrets.js';

const { MONGO_DATABASE: DATABASE, MONGO_PASSWORD_SERVICE: PASSWORD, MONGO_USER_SERVICE: USER } = secrets;
const { MONGO_ARGS: ARGS, MONGO_DOCKER_PORT: PORT, MONGO_HOST: HOST, MONGO_PROTOCOL: PROTOCOL } = env();

const MONGO_URI = `${PROTOCOL}://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}${ARGS}`;

// DANGER:  Ensure logger for current ENV is not storing credentials; level INFO or higher.
pinoLogger.server.debug(MONGO_URI);

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

type MongoServerEvents = {
  [Key in keyof TopologyEvents]?: boolean;
};

class ServerEventsLogger {
  private readonly MongoClient;
  private readonly eventNames;

  constructor(mongoClient: MongoClient, eventName: MongoServerEvents) {
    this.MongoClient = mongoClient;
    this.eventNames = eventName;

    Object.keys(this.eventNames).forEach((event) => {
      this.MongoClient.on(event, () => {
        pinoLogger.server.info(`${event}: MongoDB: @${HOST}:${PORT}/${DATABASE}`);
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
    const errMsg = `Cannot connect to Mongo: ${DATABASE} @ ${HOST}`;
    process.exitCode = 1;

    pinoLogger.server.fatal(error, errMsg);
    rollbar.critical(errMsg, error as Error, () => {
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      process.exit();
    });
  }
};

const mongoDB = mongoClient.db(`${DATABASE}`);

export { connectMongoDB, mongoClient, mongoDB };
