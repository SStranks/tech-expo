import { replaceTscAliasPaths } from 'tsc-alias';
import { connectMongoDB, disconnectMongoDB } from '#Config/dbMongo';
import { pinoLogger, rollbar } from '#Helpers/index';
import app from '#App/app';

if (process.env.NODE_ENV === 'production') {
  replaceTscAliasPaths();
}

const PORT = process.env.NODE_DOCKER_PORT || process.env.NODE_LOCAL_PORT || 4000;

// ------------

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

// NOTE:  Add in event emitter; once DB established, make event, catch it here and then trigger app.listen
// https://awan.com.np/make-app-listen-only-after-db-connection-in-node/
connectMongoDB();

const server = app.listen(PORT, () => {
  pinoLogger.info(`Server running successfuly in ${process.env.NODE_ENV} mode on Port ${PORT}`);
});

// Unhandled Rejection Errors
process.on('unhandledRejection', (err: Error) => {
  process.exitCode = 1;
  const exitMsg = `UnhandledRejection; Exit Code: ${process.exitCode}`;
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
  await disconnectMongoDB();
  pinoLogger.info(exitMsg);
  server.close(() => {
    console.log('Server terminated');
  });
});

// SIGINT
process.on('SIGINT', async () => {
  const exitMsg = 'SIGINT signal received. Shutting down server';
  await disconnectMongoDB();
  pinoLogger.info(exitMsg);
  server.close(() => {
    console.log('Server terminated');
  });
});
