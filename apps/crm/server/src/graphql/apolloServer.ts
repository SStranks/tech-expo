import { ApolloServer } from '@apollo/server';

import pinoLogger from '#Helpers/pinoLogger';
import rollbar from '#Helpers/rollbar';

import formatError from './errors';
import schema from './schema';

const introspection = process.env.NODE_ENV !== 'production';

const apolloServer = new ApolloServer({ formatError, introspection, schema });

try {
  await apolloServer.start();
} catch (error) {
  const errMsg = `Cannot establish GraphQL ApolloServer`;
  process.exitCode = 1;

  pinoLogger.fatal(error, errMsg);
  rollbar.critical(errMsg, error as Error, () => {
    // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
    process.exit();
  });
}
pinoLogger.info('Connected to GraphQL ApolloServer');

export { apolloServer };
