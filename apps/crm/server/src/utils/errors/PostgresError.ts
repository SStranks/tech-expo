import type { DbErrorKind } from '#Config/dbPostgres.js';

import type { CustomErrorContent } from './CustomError.js';

import CustomError from './CustomError.js';

export default class PostgresError extends CustomError {
  private readonly _kind: DbErrorKind;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: unknown };

  constructor(params?: {
    context?: { [key: string]: unknown };
    kind?: DbErrorKind;
    logging?: boolean;
    message?: string;
  }) {
    const { kind, logging, message } = params || {};

    super(message || 'Database Error: Contact Support');
    this._kind = kind || 'UNKNOWN';
    this._logging = logging || false;
    this._context = params?.context || {};

    Object.setPrototypeOf(this, PostgresError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  get errors(): CustomErrorContent[] {
    return [{ context: this._context, message: this.message }];
  }

  get kind(): DbErrorKind {
    return this._kind;
  }

  get logging(): boolean {
    return this._logging;
  }
}
