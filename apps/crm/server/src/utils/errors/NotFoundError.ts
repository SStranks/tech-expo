import AppError from './AppError.js';

export class NotFoundError extends AppError {
  readonly name = 'NotFoundError';

  constructor(params: { context?: Record<string, unknown>; logging?: boolean; resource?: string }) {
    super({
      code: 'RESOURCE_NOT_FOUND',
      context: params.context,
      httpStatus: 404,
      logging: params.logging ?? false,
      message: `${params.resource ?? 'Resource'} not found`,
    });

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
