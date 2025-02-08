import { ZodError } from 'zod';

import { CustomError } from './CustomError.js';

export default class ZodValidationError extends CustomError {
  private static readonly _statusCode = 400;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: unknown };
  private readonly _zod: { error: ZodError };

  constructor(params: {
    code?: number;
    message?: string;
    logging?: boolean;
    context?: { [key: string]: unknown };
    zod: { error: ZodError };
  }) {
    const { code, logging, message } = params || {};

    super(message || 'Validation Error');
    this._code = code || ZodValidationError._statusCode;
    this._logging = logging || false;
    this._context = params?.context || {};
    this._zod = params?.zod;

    Object.setPrototypeOf(this, ZodValidationError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get zodError() {
    return this._zod;
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
//     throw new ZodValidationError({code: 400, message: "Name is required!", logging: true});
//   }
// }
