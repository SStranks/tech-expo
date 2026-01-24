/* eslint-disable perfectionist/sort-objects */
import AppError from './AppError.js';

type ConstructorParams = {
  message?: string;
  context?: Record<string, unknown>;
  logging?: boolean;
};

export default class BadRequestError extends AppError {
  readonly name = 'BadRequestError';

  constructor({ message = 'Bad Request', context, logging }: ConstructorParams) {
    super({
      message,
      code: 'BAD_REQUEST',
      httpStatus: 400,
      context,
      logging: logging ?? false,
    });

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
