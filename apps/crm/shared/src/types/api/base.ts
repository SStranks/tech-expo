import type { ApiError, ApiErrorDev } from './errors.js';

export type UUID = string & { readonly __uuid: unique symbol };

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
