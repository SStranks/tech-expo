import type { DbErrorKind } from '#Config/dbPostgres.js';
import type { ExtendedApolloErrorCode } from '#Graphql/errors.js';

import { ApolloServerErrorCode } from '@apollo/server/errors';

export function mapPostgresKindToGraphQLCode(kind: DbErrorKind): ExtendedApolloErrorCode {
  switch (kind) {
    case 'CONNECTION_FAILURE': {
      return ApolloServerErrorCode.INTERNAL_SERVER_ERROR;
    }
    case 'AUTHORIZATION_ERROR': {
      return 'FORBIDDEN';
    }
    case 'CONSTRAINT_VIOLATION': {
      return ApolloServerErrorCode.BAD_USER_INPUT;
    }
    case 'NOT_FOUND': {
      return 'NOT_FOUND';
    }
    case 'INVALID_STATE': {
      return ApolloServerErrorCode.BAD_REQUEST;
    }
    case 'TRANSIENT_FAILURE': {
      return 'SERVICE_UNAVAILABLE';
    }
    case 'CONFIG_ERROR': {
      return ApolloServerErrorCode.INTERNAL_SERVER_ERROR;
    }
    case 'INTERNAL_ERROR': {
      return ApolloServerErrorCode.INTERNAL_SERVER_ERROR;
    }
    case 'UNKNOWN': {
      return ApolloServerErrorCode.INTERNAL_SERVER_ERROR;
    }
    default: {
      return ApolloServerErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}

export function mapPostgresKindToHttp(kind: DbErrorKind): number {
  switch (kind) {
    case 'NOT_FOUND': {
      return 404;
    }
    case 'CONNECTION_FAILURE': {
      return 503;
    }
    case 'AUTHORIZATION_ERROR': {
      return 403;
    }
    case 'CONSTRAINT_VIOLATION': {
      return 409;
    }
    case 'INVALID_STATE': {
      return 400;
    }
    case 'TRANSIENT_FAILURE': {
      return 503;
    }
    case 'CONFIG_ERROR': {
      return 500;
    }
    case 'INTERNAL_ERROR': {
      return 500;
    }
    case 'UNKNOWN': {
      return 500;
    }
    default: {
      return 500;
    }
  }
}
