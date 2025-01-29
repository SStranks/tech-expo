import type { GraphQLSchema } from 'graphql';

import { makeExecutableSchema } from '@graphql-tools/schema';

import pinoLogger from '#Helpers/pinoLogger';
import rollbar from '#Helpers/rollbar';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { resolvers } from './resolvers';

// NOTE:  ApolloServer utilizes makeExecutableSchema under the hood but does not catch its errors/propagate into the available error handling API.

const CUR = path.dirname(url.fileURLToPath(import.meta.url));
const typeDefs = await readFile(path.resolve(CUR, '../graphql/schema.graphql'), 'utf8');

let schema;
try {
  schema = makeExecutableSchema({ resolvers, typeDefs });
} catch (error) {
  const errMsg = `Invalid GraphQL Schema Definition`;
  process.exitCode = 1;

  pinoLogger.fatal(error, errMsg);
  rollbar.critical(errMsg, error as Error, () => {
    // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
    process.exit();
  });
}

export default schema as GraphQLSchema;
