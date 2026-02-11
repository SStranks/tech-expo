/* eslint-disable unicorn/no-process-exit */
/* eslint-disable n/no-process-exit */
import { env } from '#Config/env.js';
import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';

const { EXPRESS_DOCKER_PORT, EXPRESS_LOCAL_PORT, NODE_ENV } = env;
const PORT = EXPRESS_DOCKER_PORT || EXPRESS_LOCAL_PORT || 4000;

// ------------------------------------------------------------------------

import { connectMongoDB, mongoClient } from '#Config/dbMongo.js';
import { connectPostgresDB, postgresClient } from '#Config/dbPostgres.js';
import { connectRedisDB, redisClient } from '#Config/dbRedis.js';

await connectMongoDB();
await connectPostgresDB();
await connectRedisDB();

// ------------------------------------------------------------------------

import httpServer from '#App/httpServer.js';
import '#App/app';
import { apolloServer } from '#Graphql/apolloServer.js';

httpServer.listen(PORT, () => {
  pinoLogger.server.info(`Server running successfuly in ${NODE_ENV} mode on Port ${PORT}`);
});

const shutdown = async (signal: string, error?: Error) => {
  const exitMsg = `${signal} received. Shutting down server`;

  try {
    await apolloServer.stop();
    await mongoClient.close();
    await postgresClient.end();
    redisClient.destroy();

    pinoLogger.server.fatal(exitMsg);
    rollbar.critical(exitMsg, error);
    httpServer.close(() => {
      console.log('Server terminated');
      process.exit(0);
    });

    setTimeout(() => {
      process.exit(1);
    }, 3000);
  } catch (error) {
    pinoLogger.server.error(error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
