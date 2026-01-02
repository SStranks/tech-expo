import CustomError from './CustomError.js';

export default class AppError extends CustomError {
  private static readonly _statusCode = 500;
  private readonly _code: number;
  private readonly _context: { [key: string]: unknown };
  public readonly _isOperational: boolean;
  public readonly _logging: boolean;

  constructor(params?: {
    isOperational?: boolean;
    code?: number;
    message?: string;
    logging?: boolean;
    context?: { [key: string]: unknown };
  }) {
    const { code, isOperational, logging, message } = params || {};

    super(message || 'Internal Server Error');
    this._code = code || AppError._statusCode;
    this._logging = logging || false;
    this._context = params?.context || {};
    this._isOperational = isOperational ?? false;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get errors() {
    return [{ context: this._context, message: this.message }];
  }

  get statusCode() {
    return this._code;
  }

  get isOperational() {
    return this._isOperational;
  }

  get logging() {
    return this._logging;
  }
}
