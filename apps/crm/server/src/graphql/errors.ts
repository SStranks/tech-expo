import type { GraphQLFormattedError } from 'graphql';

import { ApolloServerErrorCode } from '@apollo/server/errors';

import pinoLogger from '#Helpers/pinoLogger';
import { PostgresError } from '#Utils/errors';

const formatError = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  if (formattedError.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR) {
    pinoLogger.error(formattedError, 'GraphQL: Initialized from formatError');
  }

  if (formattedError.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
    return {
      ...formattedError,
      message: "Your query doesn't match the schema. Try double-checking it!",
    };
  }

  if (error instanceof PostgresError) {
    return { message: 'Internal server error' };
  }

  return formattedError;
};

export default formatError;
