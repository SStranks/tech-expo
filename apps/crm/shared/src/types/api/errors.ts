export type ApiError = {
  message: string;
  errors?: unknown;
};

export type ApiErrorDev = ApiError & {
  stack?: string;
};
