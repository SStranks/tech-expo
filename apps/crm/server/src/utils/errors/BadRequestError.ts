import AppError from './AppError.js';

type ConstructorParams = {
  context?: Record<string, unknown>;
  logging?: boolean;
  message?: string;
};

export default class BadRequestError extends AppError {
  readonly name = 'BadRequestError';

  constructor({ message = 'Bad Request', context, logging }: ConstructorParams) {
    super({
      code: 'BAD_REQUEST',
      context,
      httpStatus: 400,
      logging: logging ?? false,
      message,
    });

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
