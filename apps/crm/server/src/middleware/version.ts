import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '#Utils/errors';

// API Versioning
const version = function (version: number) {
  return function (req: Request, _res: Response, next: NextFunction) {
    let requestVersion = Number.parseInt(req.params.version.slice(1));

    if (typeof requestVersion !== 'number') {
      return next(new BadRequestError({ message: 'Invalid API version', logging: true }));
    } else if (requestVersion >= version) {
      return next();
    }
    return next('route');
  };
};

export default version;
