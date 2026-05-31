import AppError from './AppError.js';

export default class ForbiddenError extends AppError {
  readonly name = 'ForbiddenError';

  constructor(params: { context?: Record<string, unknown>; logging?: boolean; message?: string }) {
    super({
      code: 'FORBIDDEN',
      context: params.context,
      httpStatus: 403,
      logging: params.logging ?? false,
      message: params.message ?? 'Access Denied',
    });

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
