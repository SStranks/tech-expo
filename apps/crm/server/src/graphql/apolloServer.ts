import type { GraphqlContext } from './context.js';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import httpServer from '#App/httpServer.js';
import { env } from '#Config/env.js';
import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';

import formatError from './errors.js';
import schema from './schema.js';

const { NODE_ENV } = env();

const introspection = NODE_ENV !== 'production';
const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];

const apolloServer = new ApolloServer<GraphqlContext>({ formatError, introspection, plugins, schema });

try {
  await apolloServer.start();
} catch (error) {
  const errMsg = `Cannot establish GraphQL ApolloServer`;
  process.exitCode = 1;

  pinoLogger.server.fatal(error, errMsg);
  rollbar.critical(errMsg, error as Error, () => {
    // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
    process.exit();
  });
}
pinoLogger.server.info('Connected to GraphQL ApolloServer');

export { apolloServer };
