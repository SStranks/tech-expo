import type { AxiosResponse } from 'axios';

import axiosClient, { type IAxiosClient } from '@Lib/axios';
import AppError from '@Utils/AppError';

export type TBody = { [x: string]: unknown };

export interface IServiceHttp {
  accountIdentify(): Promise<AxiosResponse>;
  accountLogin(body: TBody): Promise<AxiosResponse>;
  accountLogout(): Promise<AxiosResponse>;
  accountUpdatePassword(body: TBody): Promise<AxiosResponse>;
  accountFreeze(): Promise<AxiosResponse>;
  accountDelete(body: TBody): Promise<AxiosResponse>;
}

class ServiceHttp implements IServiceHttp {
  public ApiServiceClient: IAxiosClient;

  constructor(apiClient: IAxiosClient) {
    this.ApiServiceClient = apiClient;
  }

  /*
   * TODO: eturn user and roles from API as response?
   * TODO: 'throw errors' - tidy up; graceful error UI required.
   * NOTE: Throw is necessary to propagate into redux authSlice.
   */
  async accountLogin(body: TBody) {
    try {
      const response = await this.ApiServiceClient.post<TBody>('/api/users/login', body, { withCredentials: true });
      return response.data;
    } catch (error) {
      if (error instanceof AppError && error.statusCode) {
        console.error(error.message);
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async accountLogout() {
    try {
      const response = await this.ApiServiceClient.get('/api/users/logout', { withCredentials: true });
      return response.data;
    } catch (error) {
      if (error instanceof AppError && error.statusCode) {
        console.error(error.message);
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async accountIdentify() {
    try {
      const response = await this.ApiServiceClient.get('/api/users/identify', { withCredentials: true });
      return response.data;
    } catch (error) {
      if (error instanceof AppError && error.statusCode) {
        console.error(error.message);
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async accountUpdatePassword(body: TBody) {
    try {
      const response = await this.ApiServiceClient.patch<TBody>('/api/users/identify', body, { withCredentials: true });
      return response.data;
    } catch (error) {
      if (error instanceof AppError && error.statusCode) {
        console.error(error.message);
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async accountFreeze() {
    try {
      const response = await this.ApiServiceClient.patch('/api/users/freezeAccount', { withCredentials: true });
      return response.data;
    } catch (error) {
      if (error instanceof AppError && error.statusCode) {
        console.error(error.message);
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async accountDelete(body: TBody) {
    try {
      const response = await this.ApiServiceClient.patch<TBody>('/api/users/deleteAccount', body, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AppError && error.statusCode) {
        console.error(error.message);
        throw error;
      }
      console.error(error);
      throw error;
    }
  }
}

export default new ServiceHttp(axiosClient);
