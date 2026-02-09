import type { ApiError, ApiErrorDev, ApiResponseError } from '@apps/crm-shared';
import type { ErrorRequestHandler, Response } from 'express';

import postgres from 'postgres';
import { ZodError } from 'zod';

import { postgresErrorDomainMapper, postgresKindToHttp } from '#Config/dbPostgres.js';
import pinoLogger from '#Lib/pinoLogger.js';
import rollbar from '#Lib/rollbar.js';
import AppError from '#Utils/errors/AppError.js';
import BadRequestError from '#Utils/errors/BadRequestError.js';
import PostgresError from '#Utils/errors/PostgresError.js';
import ZodValidationError from '#Utils/errors/ZodValidationError.js';

const { NODE_ENV } = process.env;

const getHttpCode = (error: unknown): number => {
  if (error instanceof ZodValidationError) return 400;
  if (error instanceof PostgresError) return postgresKindToHttp(error.kind);
  if (error instanceof BadRequestError) return 400;
  if (error instanceof AppError) return error.httpStatus;
  return 500;
};

const devErrorResponse = (error: NormalizedError, res: Response<ApiErrorDev>) => {
  const httpCode = getHttpCode(error);

  if (error instanceof AppError && !error.isOperational) {
    pinoLogger.app.error(error, `Non-Operational Error: ${error.message}`);
    return res.status(httpCode).json({
      errors: error,
      message: `Non-Operational Error: ${error.message}`,
      stack: error.stack,
    });
  } else {
    const { errors, message, stack } = error;
    pinoLogger.app.error(error, `GlobalErrorHandler: ${message}`);
    return res.status(httpCode).json({ errors, message, stack });
  }
};

const prodErrorResponse = (error: NormalizedError, res: Response<ApiError>) => {
  if (error instanceof AppError && !error.isOperational) {
    const errMsg = 'Non-Operational Error';
    pinoLogger.app.error(error, errMsg);
    rollbar.error(errMsg, error);

    return res.status(500).json({ message: `${errMsg}. Contact support` });
  } else {
    const httpCode = getHttpCode(error);
    const { cause, errors, logging, message, name, stack } = error;

    if (logging) {
      pinoLogger.app.error({ name, cause, errors, stack }, 'Operational Error');
    }

    return res.status(httpCode).json({ errors, message });
  }
};

type NormalizedError = AppError | ZodValidationError | PostgresError;
const normalizeError = (error: unknown): NormalizedError => {
  if (error instanceof ZodError) {
    return new ZodValidationError({ context: { error }, logging: true, zod: { error } });
  }

  if (error instanceof postgres.PostgresError) {
    const { kind, message } = postgresErrorDomainMapper(error.code);
    return new PostgresError({
      context: { error, message: error.message },
      kind,
      message,
    });
  }

  if (error instanceof AppError) return error;

  return new AppError({
    code: 'UNKNOWN_ERROR',
    httpStatus: 500,
    isOperational: false,
    logging: true,
    message: 'Unknown error',
  });
};

const globalErrorHandler: ErrorRequestHandler = (error, _req, res: Response<ApiResponseError>, next) => {
  if (res.headersSent) return next(error);
  const normalizedError = normalizeError(error);

  if (NODE_ENV !== 'production') {
    return devErrorResponse(normalizedError, res);
  }

  return prodErrorResponse(normalizedError, res);
};

export default globalErrorHandler;
