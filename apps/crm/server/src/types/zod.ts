import type z from 'zod';

export type ZodShapeFrom<T> = {
  [K in keyof T]: z.ZodType;
};

export type ZodShapeFromSchema<T> = Partial<{ [K in keyof T]: z.ZodType }>;
