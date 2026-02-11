import type { GraphQLFormattedError, GraphQLFormattedErrorExtensions } from 'graphql';

import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

import pinoLogger from '#Lib/pinoLogger.js';
import { mapPostgresKindToGraphQLCode, mapPostgresKindToHttp } from '#Mappers/errorMapper.js';
import AppError from '#Utils/errors/AppError.js';
import PostgresError from '#Utils/errors/PostgresError.js';

export type ExtendedApolloErrorCode = ApolloServerErrorCode | 'FORBIDDEN' | 'SERVICE_UNAVAILABLE' | 'NOT_FOUND';

const apolloServerErrorsMap: GraphQLFormattedErrorExtensions = {
  BAD_REQUEST: 400,
  BAD_USER_INPUT: 400,
  GRAPHQL_PARSE_FAILED: 400,
  GRAPHQL_VALIDATION_FAILED: 400,
  INTERNAL_SERVER_ERROR: 500,
  OPERATION_RESOLUTION_FAILURE: 400,
  PERSISTED_QUERY_NOT_FOUND: 200,
  PERSISTED_QUERY_NOT_SUPPORTED: 400,
};

const formatError = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  const code = formattedError.extensions?.code;

  if (code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR) {
    pinoLogger.server.error(error, 'GraphQL: Caught in formatError; INTERNAL_SERVER_ERROR');
    return new GraphQLError('Internal Server Error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: { status: 500 },
      },
    });
  }

  if (code) {
    return {
      ...formattedError,
      extensions: {
        ...formattedError.extensions,
        code,
        http: { status: apolloServerErrorsMap[`${code as keyof typeof apolloServerErrorsMap}`] ?? 400 },
      },
    };
  }

  if (error instanceof PostgresError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: mapPostgresKindToGraphQLCode(error.kind),
        http: { status: mapPostgresKindToHttp(error.kind) },
      },
    });
  }

  if (error instanceof AppError) {
    if (error.logging) {
      pinoLogger.app.error(error, 'GraphQL APP_ERROR');
    }

    return new GraphQLError(error.message, {
      extensions: {
        code: error.code,
        httpStatus: error.httpStatus,
      },
    });
  }

  pinoLogger.server.error(error, 'GraphQL UNKNOWN_ERROR');
  return new GraphQLError('Internal Server Error', {
    extensions: {
      code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
      http: { status: 500 },
    },
  });
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

export function invalidInputError(message: string, fieldErrors?: Record<string, string[]>, formErrors?: string[]) {
  return new GraphQLError(message, {
    extensions: { code: 'INVALID_INPUT', fieldErrors, formErrors, http: { status: 400 } },
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
