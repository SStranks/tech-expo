/* eslint-disable n/no-process-exit */
import { validateEnvironmentVariables } from '#Config/env.js';
import { initializeDockerSecrets } from '#Config/secrets.js';
import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';

process.on('uncaughtException', (error: Error) => {
  try {
    pinoLogger.crash.fatal(error, 'Uncaught Exception');
    rollbar.critical('Uncaught Exception', error, () => {
      process.exit(1);
    });

    setTimeout(() => {
      process.exit(1);
    }, 3000);
  } catch {
    process.exit(1);
  }
});

process.on('unhandledRejection', (error: Error) => {
  try {
    pinoLogger.crash.fatal(error, 'Uncaught Exception');
    rollbar.critical('Uncaught Exception', error, () => {
      process.exit(1);
    });

    setTimeout(() => {
      process.exit(1);
    }, 3000);
  } catch {
    process.exit(1);
  }
});

validateEnvironmentVariables();
initializeDockerSecrets();

await import('./server.js');
