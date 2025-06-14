import type { ApiResponseError } from '@apps/crm-shared';
import type { ErrorRequestHandler, Response } from 'express';

import postgres from 'postgres';
import { ZodError } from 'zod';

import { postgresErrorHTTPMapper } from '#Config/dbPostgres.js';
import { pinoLogger, rollbar } from '#Lib/index.js';
import { CustomError, PostgresError, ZodValidationError } from '#Utils/errors/index.js';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res: Response<ApiResponseError>, _next) => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    if (err instanceof CustomError) {
      const { errors, message, stack, status, statusCode } = err;

      pinoLogger.error(err, `GlobalErrorHandler: ${message}`);
      res.status(statusCode).json({ errors, message, stack, status });
      return;
    }

    pinoLogger.error(err, `Non-Operational Error: ${err.message}`);
    res.status(500).json({
      errors: err,
      message: `Non-Operational Error: ${err.message}`,
      stack: err.stack,
      status: 'error',
    });
    return;
  }

  // NODE_ENV: PRODUCTION
  let error = err;
  if (error instanceof ZodError) error = new ZodValidationError({ context: { error }, logging: true, zod: { error } });
  if (error instanceof postgres.PostgresError) {
    const { httpCode, message } = postgresErrorHTTPMapper(error.code);
    error = new PostgresError({
      code: httpCode,
      context: { error, message: error.message },
      logging: httpCode >= 500,
      message,
    });
  }

  if (err instanceof ZodValidationError) {
    const { errors, logging, message, stack, status, statusCode, zodError } = err;

    if (logging) {
      const logError = JSON.stringify({ errors, stack, statusCode });
      pinoLogger.error(logError, 'Operational Error');
    }

    // Return user friendly Zod error
    const validationErrors = zodError.error.format();

    res.status(statusCode).json({ errors: validationErrors, message, status });
    return;
  }

  // Includes: AppError, BadRequestError, PostgresError
  if (err instanceof CustomError) {
    const { errors, logging, message, stack, status, statusCode } = err;

    if (logging) {
      const logError = JSON.stringify({ errors, stack, statusCode });
      pinoLogger.error(logError, 'Operational Error');
    }

    res.status(statusCode).json({ errors, message, status });
    return;
  }

  // Unhnandled Errors
  const errMsg = 'Non-Operational Error';
  pinoLogger.error(err, errMsg);
  rollbar.error(errMsg, err);

  res.status(500).json({
    errors: err,
    message: `${errMsg}. Contact support`,
    status: 'error',
  });
};

export default globalErrorHandler;
