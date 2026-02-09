import type { ApiError, ApiErrorDev } from './errors.js';

export type UUID = string & { __uuid?: never };

// https://jsonapi.org/
export type ApiResponse<T> = ApiResponseSuccessData<T> | ApiResponseError;

export interface ApiResponseSuccess {
  status: 'success';
  message: string;
}
export interface ApiResponseSuccessData<T> extends ApiResponseSuccess {
  data: T;
}

export type ApiResponseError = ApiError | ApiErrorDev;
