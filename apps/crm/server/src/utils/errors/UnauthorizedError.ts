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
      code: 'UNAUTHENTICATED',
      context,
      httpStatus: 401,
      logging: logging ?? false,
      message,
    });

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
