import { AnyZodObject, ZodError, z } from 'zod';
import ZodValidationError from './errors/ZodValidationError';
import { BadRequestError } from './errors';

// NOTE:  Change 'any' back to request when finished experimenting.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function zParse<T extends AnyZodObject>(schema: T, req: any): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ZodValidationError({ zod: { error }, context: { error }, logging: true });
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

export {};
