import { z, ZodError, ZodObject } from 'zod';

import BadRequestError from '#Utils/errors/BadRequestError.js';
import ZodValidationError from '#Utils/errors/ZodValidationError.js';

// NOTE:  Change 'any' back to request when finished experimenting.
export async function zParse<T extends ZodObject>(schema: T, req: any): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ZodValidationError({ context: { error }, logging: true, zod: { error } });
    }
    throw new BadRequestError({ code: 404, context: { error }, logging: true });
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
