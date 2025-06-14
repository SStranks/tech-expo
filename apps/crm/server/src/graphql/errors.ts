import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';

import pinoLogger from '#Lib/pinoLogger.js';
import { AppError, PostgresError } from '#Utils/errors/index.js';

const formatError = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  if (formattedError.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
    return {
      ...formattedError,
      message: "Your query doesn't match the schema. Try double-checking it!",
    };
  }

  if (formattedError.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR) {
    pinoLogger.error(error, 'GraphQL: Caught in formatError; INTERNAL_SERVER_ERROR');
    return new GraphQLError('Internal Server Error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: { status: 500 },
      },
    });
  }

  if (error instanceof PostgresError) {
    if (error.statusCode >= 500) {
      pinoLogger.error(error, 'GraphQL: Caught in formatError; PostgresError');
      return new GraphQLError('Internal Server Error', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: 500 },
        },
      });
    }
    return new GraphQLError(error.message, {
      extensions: {
        code: formattedError.extensions?.code ?? 'BAD_REQUEST',
        http: { status: error.statusCode },
      },
    });
  }

  if (error instanceof AppError) {
    pinoLogger.error(error, 'GraphQL: Caught in formatError; AppError');
    return new GraphQLError('Internal Server Error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: { status: 500 },
      },
    });
  }

  return formattedError;
};

export function dbInconsistencyError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'DB_INCONSISTENCY', http: { status: 500 } },
  });
}

export function notFoundError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND', http: { status: 404 } },
  });
}

export function invalidInputError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'INVALID_INPUT', http: { status: 400 } },
  });
}

export function unauthenticatedError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
  });
}

export function unauthorizedError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED', http: { status: 403 } },
  });
}

export default formatError;
