import type { ZodError, ZodFlattenedError } from 'zod';

import type { CustomErrorContent } from './CustomError.js';

import z from 'zod';

import CustomError from './CustomError.js';

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
    const { code, logging, message } = params;

    super(message || 'Validation Error');
    this._code = code || ZodValidationError._statusCode;
    this._logging = logging || false;
    this._context = params.context || {};
    this._zod = { error: params.zod.error };

    Object.setPrototypeOf(this, ZodValidationError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get zodError() {
    return this._zod;
  }

  get errors() {
    const { fieldErrors, formErrors }: ZodFlattenedError<unknown> = z.flattenError(this._zod.error);
    const result: CustomErrorContent[] = [];

    for (const message of formErrors) {
      result.push({ message });
    }

    for (const messages of Object.values(fieldErrors)) {
      if (messages) {
        for (const message in messages) {
          result.push({ message });
        }
      }
    }

    return result;
  }

  get treeErrors() {
    return z.treeifyError(this._zod.error);
  }

  get context() {
    return [{ context: this._context, message: this.message }];
  }

  get logging() {
    return this._logging;
  }
}
