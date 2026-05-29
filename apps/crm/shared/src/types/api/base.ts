import type { ApiError, ApiErrorDev } from './errors.js';

export type UUID = string & { readonly __uuid: 'UUID' };

// https://jsonapi.org/
export type ApiResponse<T> = ApiResponseSuccessData<T> | ApiResponseError;

export interface ApiResponseSuccess {
  message: string;
  status: 'success';
}
export interface ApiResponseSuccessData<T> extends ApiResponseSuccess {
  data: T;
}

export type ApiResponseError = ApiError | ApiErrorDev;
