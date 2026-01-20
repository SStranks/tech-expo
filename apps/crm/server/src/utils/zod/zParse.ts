import type { Request } from 'express';
import type { z, ZodObject } from 'zod';

import { ZodError } from 'zod';

import BadRequestError from '#Utils/errors/BadRequestError.js';
import ZodValidationError from '#Utils/errors/ZodValidationError.js';

import DomainError from '../errors/DomainError.js';

// NOTE:  Change 'any' back to request when finished experimenting.
export async function zParse<T extends ZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ZodValidationError({ context: { error }, logging: true, zod: { error } });
    }
    throw new BadRequestError({ context: { error }, logging: true, message: 'Bad Request' });
  }
}

export function zParseDomain<T>(schema: z.ZodType<T>, value: unknown): T {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodValidationError) {
      throw new DomainError({ message: error.message });
    }
    throw new DomainError({ message: 'Domain error' });
  }
}

// https://dev.to/franciscomendes10866/schema-validation-with-zod-and-expressjs-111p#comment-1kn87
// import type { Request, Response, NextFunction } from 'express';
// import { AnyZodObject, ZodError, z } from 'zod';
// import { badRequest } from '@hapi/boom';

// export async function zParse<T extends AnyZodObject>(
//   schema: T,
//   req: Request
// ): Promise<z.infer<T>> {
//   try {
//     return await schema.parseAsync(req);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       // INSERT MY CUSTOM BADREQUEST ERROR HERE
//       throw badRequest(error.message);
//     }
//     return badRequest(JSON.stringify(error));
//   }
// }

// ROUTE
// app.get('/', (req, res, next) => {
//   const token = await validateToken(req);
//   const { params, query: {page, pageSize}, body } = await zParse(mySchema, req);
//   await myHandler({token, page, pageSize})
// }
