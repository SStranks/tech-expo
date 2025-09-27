import type { GraphQLSchema } from 'graphql';

import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  DateTimeTypeDefinition,
  EmailAddressTypeDefinition,
  HexColorCodeDefinition,
  JSONDefinition,
  UUIDDefinition,
} from 'graphql-scalars';

import { pinoLogger, rollbar } from '#Lib/index.js';

import resolvers from './resolvers.js';
import schemaTypeDefs from './typedefs.js';

/*
 * NOTE: ApolloServer utilizes makeExecutableSchema under the hood;
 * but does not catch its errors/propagate into the available error handling API.
 */
const customTypeDefs = [
  DateTimeTypeDefinition,
  HexColorCodeDefinition,
  EmailAddressTypeDefinition,
  JSONDefinition,
  UUIDDefinition,
];
const typeDefs = [...customTypeDefs, schemaTypeDefs];

let schema;
try {
  schema = makeExecutableSchema({ resolvers, typeDefs });
} catch (error) {
  const errMsg = `Invalid GraphQL Schema Definition`;
  process.exitCode = 1;

  pinoLogger.server.fatal(error, errMsg);
  rollbar.critical(errMsg, error as Error, () => {
    // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
    process.exit();
  });
}

export default schema as GraphQLSchema;
