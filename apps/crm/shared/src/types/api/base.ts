export type UUID = string & { __uuid?: never };

// https://jsonapi.org/
export type ApiResponse<T> = ApiResponseSuccessData<T> | ApiResponseError<T>;

export interface ApiResponseSuccess {
  status: 'success';
  message: string;
}
export interface ApiResponseSuccessData<T> extends ApiResponseSuccess {
  data: T;
}

export interface ApiResponseError<T> {
  status: 'error';
  message: string;
  errors: T;
  stack?: string | undefined;
}
