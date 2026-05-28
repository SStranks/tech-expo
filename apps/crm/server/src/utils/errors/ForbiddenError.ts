/* eslint-disable perfectionist/sort-objects */
import AppError from './AppError.js';

export default class ForbiddenError extends AppError {
  readonly name = 'ForbiddenError';

  constructor(params: { context?: Record<string, unknown>; logging?: boolean; message?: string }) {
    super({
      message: params.message ?? 'Access Denied',
      code: 'FORBIDDEN',
      httpStatus: 403,
      context: params.context,
      logging: params.logging ?? false,
    });

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
