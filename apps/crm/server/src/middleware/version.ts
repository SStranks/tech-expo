import { Request, Response, NextFunction } from 'express';
import AppError from '#Utils/appError';

// API Versioning
const version = function (version: number) {
  return function (req: Request, _res: Response, next: NextFunction) {
    let requestVersion = Number.parseInt(req.params.version.slice(1));

    if (typeof requestVersion !== 'number') {
      return next(new AppError('Invalid API version', 400));
    } else if (requestVersion >= version) {
      return next();
    }
    return next('route');
  };
};

export default version;
