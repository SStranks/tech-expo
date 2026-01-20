/* eslint-disable perfectionist/sort-objects */
import AppError from './AppError.js';

export default class UnauthenticatedError extends AppError {
  readonly name = 'UnauthenticatedError';

  constructor(params: { message: 'Authentication Required'; context?: Record<string, unknown>; logging?: boolean }) {
    super({
      message: params.message,
      code: 'UNAUTHENTICATED',
      httpStatus: 401,
      context: params?.context,
      logging: params?.logging ?? false,
    });

    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }
}
