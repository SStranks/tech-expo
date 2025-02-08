import type { ErrorRequestHandler } from 'express';

import { ZodError } from 'zod';

import { pinoLogger, rollbar } from '#Helpers/index.js';
import { CustomError, PostgresError, ZodValidationError } from '#Utils/errors/index.js';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    if (err instanceof CustomError) {
      const { errors, message, stack, statusCode } = err;

      pinoLogger.error(err, `GlobalErrorHandler: ${message}`);
      res.status(statusCode).json({ errors, message, stack, statusCode });
      return;
    }

    pinoLogger.error(err, `Non-Operational Error: ${err.message}`);
    res.status(500).json({
      error: err,
      message: `Non-Operational Error: ${err.message}`,
      stack: err.stack,
    });
    return;
  }

  // NODE_ENV: PRODUCTION
  let error = err;
  if (error instanceof ZodError) error = new ZodValidationError({ context: { error }, logging: true, zod: { error } });
  if (error instanceof Error && error.name === 'PostgresError')
    error = new PostgresError({ context: { error, message: error.message }, logging: true });

  if (err instanceof ZodValidationError) {
    const { errors, logging, message, stack, statusCode, zodError } = err;

    if (logging) {
      const logError = JSON.stringify({ errors, stack, statusCode });
      pinoLogger.error(logError, 'Operational Error');
    }

    // Return user friendly Zod error
    const validationErrors = zodError.error.format();

    res.status(statusCode).json({ message, statusCode, validationErrors });
    return;
  }

  // Includes: BadRequestError, PostgresError
  if (err instanceof CustomError) {
    const { errors, logging, message, stack, statusCode } = err;

    if (logging) {
      const logError = JSON.stringify({ errors, stack, statusCode });
      pinoLogger.error(logError, 'Operational Error');
    }

    res.status(statusCode).json({ message, statusCode });
    return;
  }

  // Unhnandled Errors
  const errMsg = 'Non-Operational Error';
  pinoLogger.error(err, errMsg);
  rollbar.error(errMsg, err);

  res.status(500).json({
    status: 'Error',
    message: `${errMsg}. Contact support`,
  });
};

export default globalErrorHandler;
