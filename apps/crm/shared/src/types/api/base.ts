// https://jsonapi.org/
export type Response<T = unknown> = ResponseSuccess<T> | ResponseError<T>;

export interface ResponseSuccess<T = unknown> {
  status: 'success';
  message: string;
  data: T;
}

export interface ResponseError<T = unknown> {
  status: 'error';
  message: string;
  errors: T;
  stack?: string | undefined;
}
