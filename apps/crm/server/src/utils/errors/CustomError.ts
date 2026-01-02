export type CustomErrorContent = {
  message: string;
  context?: { [key: string]: unknown };
};

export default abstract class CustomError extends Error {
  abstract readonly errors: CustomErrorContent[];
  abstract readonly logging: boolean;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
