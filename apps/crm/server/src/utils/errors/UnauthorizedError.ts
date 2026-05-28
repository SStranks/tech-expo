/* eslint-disable perfectionist/sort-objects */
import AppError from './AppError.js';

type ConstructorParams = {
  context?: Record<string, unknown>;
  logging?: boolean;
  message?: string;
};

export default class UnauthorizedError extends AppError {
  readonly name = 'UnauthenticatedError';

  constructor({ message = 'Authentication Required', context, logging }: ConstructorParams) {
    super({
      message,
      code: 'UNAUTHENTICATED',
      httpStatus: 401,
      context,
      logging: logging ?? false,
    });

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
