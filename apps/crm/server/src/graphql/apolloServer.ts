import { ApolloServer } from '@apollo/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import pinoLogger from '#Helpers/pinoLogger';
import rollbar from '#Helpers/rollbar';

import formatError from './errors';
import { resolvers } from './resolvers';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const typeDefs = await readFile(path.resolve(CUR, '../graphql/schema.graphql'), 'utf8');

const introspection = process.env.NODE_ENV !== 'production';

const apolloServer = new ApolloServer({ formatError, introspection, resolvers, typeDefs });

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

export { apolloServer };
