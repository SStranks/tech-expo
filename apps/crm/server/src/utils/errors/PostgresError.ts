import { CustomError } from './CustomError';

export default class PostgresError extends CustomError {
  private static readonly _statusCode = 500;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: unknown };

  constructor(params?: { code?: number; message?: string; logging?: boolean; context?: { [key: string]: unknown } }) {
    const { code, message, logging } = params || {};

    super(message || 'Database Error: Contact Support');
    this._code = code || PostgresError._statusCode;
    this._logging = logging || false;
    this._context = params?.context || {};

    Object.setPrototypeOf(this, PostgresError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get errors() {
    return [{ message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._code;
  }

  get logging() {
    return this._logging;
  }
}

// ROUTE:
// try {
//   id = await postgresClient`SELECT 1`;
// } catch (error) {
//   return next(new PostgresError(`Could not create SQL: ${error}`, 404));
// }
