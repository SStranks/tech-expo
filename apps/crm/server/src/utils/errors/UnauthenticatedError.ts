/* eslint-disable perfectionist/sort-objects */
import AppError from './AppError.js';

type ConstructorParams = {
  message?: string;
  context?: Record<string, unknown>;
  logging?: boolean;
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
