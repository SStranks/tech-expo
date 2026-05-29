import { CustomError } from './CustomError';

export default class AppError extends CustomError {
  private readonly _code: number | undefined;
  private readonly _context: { [key: string]: unknown };

  constructor(params?: { code?: number; context?: { [key: string]: unknown }; message?: string }) {
    const { code, message } = params || {};

    super(message || 'Internal Client Error');
    this._code = code || undefined;
    this._context = params?.context || {};

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get context() {
    return this._context;
  }

  get errors() {
    return [{ context: this._context, message: this.message }];
  }

  get statusCode() {
    return this._code;
  }
}
