import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { pinoLogger, rollbar } from '#Helpers/index';
import { CustomError, PostgresError, ZodValidationError } from '#Utils/errors';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (process.env.NODE_ENV === 'development') {
    if (err instanceof CustomError) {
      const { statusCode, errors, message, stack } = err;

      pinoLogger.error(err, `GlobalErrorHandler: ${message}`);
      return res.status(statusCode).json({ statusCode, errors, stack });
    }

    pinoLogger.error(err, `Non-Operational Error: ${err.message}`);
    return res.status(500).json({
      message: `Non-Operational Error: ${err.message}`,
      error: err,
      stack: err.stack,
    });
  }

  // NODE_ENV: PRODUCTION
  let error = err;
  if (error instanceof ZodError) error = new ZodValidationError({ zod: { error }, context: { error }, logging: true });
  if (error instanceof Error && error.name === 'PostgresError')
    error = new PostgresError({ context: { error, message: error.message }, logging: true });

  if (err instanceof ZodValidationError) {
    const { statusCode, errors, zodError, logging, stack, message } = err;

    if (logging) {
      const logError = JSON.stringify({ statusCode, errors, stack });
      pinoLogger.error(logError, 'Operational Error');
    }

    // Return user friendly Zod error
    const validationErrors = zodError.error.format();

    return res.status(statusCode).json({ statusCode, message, validationErrors });
  }

  // Includes: BadRequestError, PostgresError
  if (err instanceof CustomError) {
    const { statusCode, errors, logging, stack, message } = err;

    if (logging) {
      const logError = JSON.stringify({ statusCode, errors, stack });
      pinoLogger.error(logError, 'Operational Error');
    }

    return res.status(statusCode).json({ statusCode, message });
  }

  // Unhnandled Errors
  const errMsg = 'Non-Operational Error';
  pinoLogger.error(err, errMsg);
  rollbar.error(errMsg, err);

  return res.status(500).json({
    status: 'Error',
    message: `${errMsg}. Contact support`,
  });
};

export default globalErrorHandler;
