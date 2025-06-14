import { ApiResponseError } from '@apps/crm-shared';

export type CustomErrorContent = {
  message: string;
  context?: { [key: string]: unknown };
};

export abstract class CustomError extends Error {
  readonly status: ApiResponseError['status'];
  abstract readonly statusCode: number;
  abstract readonly errors: CustomErrorContent[];
  abstract readonly logging: boolean;

  constructor(message: string) {
    super(message);
    this.status = 'error';
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
