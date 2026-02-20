import { ApiResponseSuccessData } from "@apps/crm-shared";

export function mockSuccess<T>(data: T): ApiResponseSuccessData<T> {
  return {
    data,
    status: 'success',
    message: 'success',
  };
}
