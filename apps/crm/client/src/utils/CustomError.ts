export type CustomErrorContent = {
  message: string;
  context?: { [key: string]: unknown };
};

export abstract class CustomError extends Error {
  abstract readonly statusCode: number | undefined;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
