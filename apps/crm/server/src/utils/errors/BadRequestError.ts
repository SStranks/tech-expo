/* eslint-disable perfectionist/sort-objects */
import AppError from './AppError.js';

export default class BadRequestError extends AppError {
  readonly name = 'BadRequestError';

  constructor(params: { message: 'Bad Request'; context?: Record<string, unknown>; logging?: boolean }) {
    super({
      message: params.message,
      code: 'BAD_REQUEST',
      httpStatus: 400,
      context: params?.context,
      logging: params?.logging ?? false,
    });

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
