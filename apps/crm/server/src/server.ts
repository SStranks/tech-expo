import { replaceTscAliasPaths } from 'tsc-alias';
import { pinoLogger, rollbar } from '#Helpers/index';

if (process.env.NODE_ENV === 'production') {
  replaceTscAliasPaths();
}

const PORT = process.env.NODE_DOCKER_PORT || process.env.NODE_LOCAL_PORT || 4000;

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

import { mongoClient } from '#Config/dbMongo';
import { connectPostgresDB, postgresClient } from '#Config/dbPostgres';

// Database Connections
// await connectMongoDB();
await connectPostgresDB();

// ------------------------------------------------------------------------

import { apolloServer } from '#Graphql/apolloServer';
import app from '#App/app';

const server = app.listen(PORT, () => {
  pinoLogger.info(`Server running successfuly in ${process.env.NODE_ENV} mode on Port ${PORT}`);
});

// Unhandled Rejection Errors
process.on('unhandledRejection', async (err: Error) => {
  process.exitCode = 1;
  const exitMsg = `UnhandledRejection; Exit Code: ${process.exitCode}`;

  await apolloServer.stop();
  await mongoClient.close();
  await postgresClient.end();

  pinoLogger.fatal(err, exitMsg);
  rollbar.critical(exitMsg, err, () => {
    server.close(() => {
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

  pinoLogger.info(exitMsg);
  server.close(() => {
    console.log('Server terminated');
  });
});

// SIGINT
process.on('SIGINT', async () => {
  const exitMsg = 'SIGINT signal received. Shutting down server';

  await apolloServer.stop();
  await mongoClient.close();
  await postgresClient.end();

  pinoLogger.info(exitMsg);
  server.close(() => {
    console.log('Server terminated');
  });
});
