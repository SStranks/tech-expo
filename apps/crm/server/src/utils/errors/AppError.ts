import CustomError from './CustomError.js';

export default class AppError extends CustomError {
  public readonly _code: string;
  public readonly _httpStatus: number;
  public readonly _context: { [key: string]: unknown };
  public readonly _isOperational: boolean;
  public readonly _logging: boolean;

  constructor(params: {
    message?: string;
    code: string;
    httpStatus: number;
    isOperational?: boolean;
    logging?: boolean;
    context?: { [key: string]: unknown };
  }) {
    super(params.message || 'Internal Server Error');

    this._code = params.code;
    this._httpStatus = params.httpStatus;
    this._isOperational = params.isOperational ?? true;
    this._logging = params.logging || false;
    this._context = params.context || {};

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get errors() {
    return [{ context: this._context, message: this.message }];
  }

  get logging() {
    return this._logging;
  }

  get code() {
    return this._code;
  }

  get httpStatus() {
    return this._httpStatus;
  }

  get isOperational() {
    return this._isOperational;
  }
}
