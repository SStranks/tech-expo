import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    authJWT?: string;
    refreshJWT?: string;
  }
}
