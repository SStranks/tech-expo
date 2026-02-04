import type { ApiResponseSuccessData } from '@apps/crm-shared';

import axios, {
  type AxiosInstance,
  type AxiosInterceptorManager,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ENV } from '@Config/env';
import handleServiceError from '@Services/serviceHttpErrors';

export interface AxiosClient {
  requestInterceptor(): AxiosInterceptorManager<InternalAxiosRequestConfig<any>>;
  responseInterceptor(): AxiosInterceptorManager<AxiosResponse<any, any>>;
  responseData<T>(response: AxiosResponse<ApiResponseSuccessData<T>>): ApiResponseSuccessData<T> | undefined;
  retryRequest(
    config: AxiosRequestConfig<any>,
    retries?: number,
    delay?: number
  ): Promise<AxiosResponse<any, any> | void>;
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<T>;
  patch<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<T>;
  put<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export class AxiosClient implements AxiosClient {
  private client: AxiosInstance;
  private clientRequestInterceptor: AxiosInterceptorManager<InternalAxiosRequestConfig<any>>;
  private clientResponseInterceptor: AxiosInterceptorManager<AxiosResponse<any, any>>;

  protected createAxiosClient(): AxiosInstance {
    return axios.create({
      baseURL: `http://${ENV.apiHost}/`,
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });
  }

  constructor() {
    this.client = this.createAxiosClient();
    this.clientRequestInterceptor = this.client.interceptors.request;
    this.clientResponseInterceptor = this.client.interceptors.response;
  }

  requestInterceptor() {
    return this.clientRequestInterceptor;
  }

  responseInterceptor() {
    return this.clientResponseInterceptor;
  }

  responseData<T>(response: AxiosResponse<T>): T | undefined {
    if (!response.data) return;
    return response.data;
  }

  async retryRequest(config: AxiosRequestConfig<any>, retries: number = 1, delay: number = 600) {
    return this.client(config)
      .then((response) => response)
      .catch((error) => {
        if (retries > 0 && !error.response) {
          setTimeout(() => {
            return this.retryRequest(config, retries - 1, 2 ** retries * delay);
          }, delay);
        } else {
          throw error;
        }
      });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async post<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async patch<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async put<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}
