/* eslint-disable perfectionist/sort-objects */
import AppError from './AppError.js';

export class NotFoundError extends AppError {
  readonly name = 'NotFoundError';

  constructor(params: { context?: Record<string, unknown>; logging?: boolean; resource?: string }) {
    super({
      message: `${params.resource ?? 'Resource'} not found`,
      code: 'RESOURCE_NOT_FOUND',
      httpStatus: 404,
      context: params.context,
      logging: params.logging ?? false,
    });

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
