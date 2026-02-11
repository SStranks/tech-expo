import type { NextFunction, Request, Response } from 'express';

import { env } from '#Config/env.js';

export interface AuthenticatedRequest extends Request {
  authJWT?: string;
  refreshJWT?: string;
}

export function extractJwtCookies(req: Request, res: Response, next: NextFunction) {
  const cookies = req.cookies as Record<string, string | undefined>;

  req.authJWT = cookies[env.JWT_COOKIE_AUTH_ID];
  req.refreshJWT = cookies[env.JWT_COOKIE_REFRESH_ID];

  next();
}
