import CustomError from './CustomError.js';

export default class DomainError extends CustomError {
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: unknown };

  constructor(params: { message: string; context?: { [key: string]: unknown } }) {
    const { context, message } = params;
    super(message);

    this._logging = false;
    this._context = context || {};

    Object.setPrototypeOf(this, DomainError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get errors() {
    return [{ context: this._context, message: this.message }];
  }

  get logging() {
    return this._logging;
  }
}
