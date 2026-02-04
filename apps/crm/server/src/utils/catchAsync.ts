import type { NextFunction, Request, Response } from 'express';

// NOTE:  DEPRECIATED; Express v5 now inherently handles async errors
const catchAsync = <T>(fn: (_req: Request, _res: Response, _next: NextFunction) => Promise<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
