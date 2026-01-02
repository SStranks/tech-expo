import AppError from './AppError.js';

export class NotFoundError extends AppError {
  constructor(params?: { message?: string; context?: Record<string, unknown>; logging?: boolean }) {
    super({
      code: 404,
      context: params?.context,
      logging: params?.logging ?? false,
      message: params?.message || 'Resource not found',
    });

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
