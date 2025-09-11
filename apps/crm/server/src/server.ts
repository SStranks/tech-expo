import { pinoLogger, rollbar } from '#Lib/index.js';

const { EXPRESS_DOCKER_PORT, EXPRESS_LOCAL_PORT, NODE_ENV } = process.env;
const PORT = EXPRESS_DOCKER_PORT || EXPRESS_LOCAL_PORT || 4000;

// ------------------------------------------------------------------------

// Unhandled Exception Errors: Needs to be before any runtime code.
process.on('uncaughtException', (err: Error) => {
  process.exitCode = 1;
  const exitMsg = `UncaughtException; Exit Code: ${process.exitCode}`;

  pinoLogger.fatal(err, exitMsg);
  rollbar.critical(exitMsg, err, () => {
    // eslint-disable-next-line n/no-process-exit
    process.exit();
  });
});

// ------------------------------------------------------------------------

import { connectMongoDB, mongoClient } from '#Config/dbMongo.js';
import { connectPostgresDB, postgresClient } from '#Config/dbPostgres.js';
import { connectRedisDB, redisClient } from '#Config/dbRedis.js';

// Database Connections
await connectMongoDB();
await connectPostgresDB();
await connectRedisDB();

// ------------------------------------------------------------------------

import httpServer from '#App/httpServer.js';
import '#App/app';
import { apolloServer } from '#Graphql/apolloServer.js';

httpServer.listen(PORT, () => {
  pinoLogger.info(`Server running successfuly in ${NODE_ENV} mode on Port ${PORT}`);
});

// Unhandled Rejection Errors
process.on('unhandledRejection', async (err: Error) => {
  process.exitCode = 1;
  const exitMsg = `UnhandledRejection; Exit Code: ${process.exitCode}`;

  await apolloServer.stop();
  await mongoClient.close();
  await postgresClient.end();
  await redisClient.destroy();

  pinoLogger.fatal(err, exitMsg);
  rollbar.critical(exitMsg, err, () => {
    httpServer.close(() => {
      // eslint-disable-next-line n/no-process-exit
      process.exit();
    });
  });
});

// SIGTERM
process.on('SIGTERM', async () => {
  const exitMsg = 'SIGTERM signal received. Shutting down server';

  await apolloServer.stop();
  await mongoClient.close();
  await postgresClient.end();
  await redisClient.destroy();

  pinoLogger.info(exitMsg);
  httpServer.close(() => {
    console.log('Server terminated');
  });
});

// SIGINT
process.on('SIGINT', async () => {
  const exitMsg = 'SIGINT signal received. Shutting down server';

  await apolloServer.stop();
  await mongoClient.close();
  await postgresClient.end();
  await redisClient.destroy();

  pinoLogger.info(exitMsg);
  httpServer.close(() => {
    console.log('Server terminated');
  });
});
