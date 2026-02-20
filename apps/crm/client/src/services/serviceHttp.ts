import type {
  ApiResponseSuccess,
  ApiResponseSuccessData,
  DeleteAccountRequestDTO,
  ForgotPasswordRequestDTO,
  IdentifyResponse,
  LoginRequestDTO,
  LoginResponse,
  UpdatePasswordRequestDTO,
  UpdatePasswordResponse,
} from '@apps/crm-shared';

import type { AxiosClient } from '@Lib/axios';

export interface IServiceHttp {
  account: {
    delete: (body: DeleteAccountRequestDTO) => Promise<ApiResponseSuccess>;
    forgotpassword: (body: ForgotPasswordRequestDTO) => Promise<ApiResponseSuccess>;
    freeze: () => Promise<ApiResponseSuccess>;
    identify: () => Promise<ApiResponseSuccessData<IdentifyResponse>>;
    login: (body: LoginRequestDTO) => Promise<ApiResponseSuccessData<LoginResponse>>;
    logout: () => Promise<ApiResponseSuccess>;
    updatepassword: (body: UpdatePasswordRequestDTO) => Promise<ApiResponseSuccessData<UpdatePasswordResponse>>;
  };
}

export class ServiceHttp implements IServiceHttp {
  public ApiServiceClient: AxiosClient;

  constructor(apiClient: AxiosClient) {
    this.ApiServiceClient = apiClient;
  }

  account = {
    delete: async (body: DeleteAccountRequestDTO): Promise<ApiResponseSuccess> => {
      const response = await this.ApiServiceClient.patch<ApiResponseSuccess, DeleteAccountRequestDTO>(
        '/api/users/deleteAccount',
        body,
        {
          withCredentials: true,
        }
      );
      return response;
    },

    forgotpassword: async (body: ForgotPasswordRequestDTO): Promise<ApiResponseSuccess> => {
      const response = await this.ApiServiceClient.patch<ApiResponseSuccess, ForgotPasswordRequestDTO>(
        '/api/users/forgotPassword',
        body,
        {
          withCredentials: true,
        }
      );
      return response;
    },

    freeze: async (): Promise<ApiResponseSuccess> => {
      const response = await this.ApiServiceClient.get<ApiResponseSuccess>('/api/users/freezeAccount', {
        withCredentials: true,
      });
      return response;
    },

    identify: async (): Promise<ApiResponseSuccessData<IdentifyResponse>> => {
      const response = await this.ApiServiceClient.get<ApiResponseSuccessData<IdentifyResponse>>(
        '/api/users/identify',
        {
          withCredentials: true,
        }
      );
      return response;
    },

    login: async (body: LoginRequestDTO): Promise<ApiResponseSuccessData<LoginResponse>> => {
      const response = await this.ApiServiceClient.post<ApiResponseSuccessData<LoginResponse>, LoginRequestDTO>(
        '/api/users/login',
        body,
        {
          withCredentials: true,
        }
      );
      return response;
    },

    logout: async (): Promise<ApiResponseSuccess> => {
      const response = await this.ApiServiceClient.get<ApiResponseSuccess>('/api/users/logout', {
        withCredentials: true,
      });
      return response;
    },

    updatepassword: async (body: UpdatePasswordRequestDTO): Promise<ApiResponseSuccessData<UpdatePasswordResponse>> => {
      const response = await this.ApiServiceClient.patch<
        ApiResponseSuccessData<UpdatePasswordResponse>,
        UpdatePasswordRequestDTO
      >('/api/users/updatePassword', body, {
        withCredentials: true,
      });
      return response;
    },
  };
}
