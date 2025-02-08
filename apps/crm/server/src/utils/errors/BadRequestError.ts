import { CustomError } from './CustomError.js';

export default class BadRequestError extends CustomError {
  private static readonly _statusCode = 400;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: unknown };

  constructor(params?: { code?: number; message?: string; logging?: boolean; context?: { [key: string]: unknown } }) {
    const { code, logging, message } = params || {};

    super(message || 'Bad request');
    this._code = code || BadRequestError._statusCode;
    this._logging = logging || false;
    this._context = params?.context || {};

    Object.setPrototypeOf(this, BadRequestError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get errors() {
    return [{ context: this._context, message: this.message }];
  }

  get statusCode() {
    return this._code;
  }

  get logging() {
    return this._logging;
  }
}

// ROUTE:
// const postHandler = (req: Request, res: Response) => {
//   const { name } = req.body;
//   if(!name) {
//     throw new BadRequestError({code: 400, message: "Name is required!", logging: true});
//   }
// }
