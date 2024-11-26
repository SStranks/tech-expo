import axios, {
  type AxiosInstance,
  type AxiosInterceptorManager,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import handleServiceError from '@Services/serviceHttpErrors';

export interface IAxiosClient {
  clientInstance: AxiosInstance;
  requestInterceptor(): AxiosInterceptorManager<InternalAxiosRequestConfig<any>>;
  responseInterceptor(): AxiosInterceptorManager<AxiosResponse<any, any>>;
  retryRequest(
    config: AxiosRequestConfig<any>,
    retries?: number,
    delay?: number
  ): Promise<AxiosResponse<any, any> | void>;
  get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  post<TRequest>(url: string, data: TRequest, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  patch<TRequest>(url: string, data: TRequest, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  put<TRequest>(url: string, data: TRequest, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
}

class axiosClient implements IAxiosClient {
  private client: AxiosInstance;
  private clientRequestInterceptor: AxiosInterceptorManager<InternalAxiosRequestConfig<any>>;
  private clientResponseInterceptor: AxiosInterceptorManager<AxiosResponse<any, any>>;

  protected createAxiosClient(): AxiosInstance {
    return axios.create({
      baseURL: `http://${process.env.API_HOST}/`,
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });
  }

  constructor() {
    this.client = this.createAxiosClient();
    this.clientRequestInterceptor = this.client.interceptors.request;
    this.clientResponseInterceptor = this.client.interceptors.response;
  }

  get clientInstance() {
    return this.client;
  }

  requestInterceptor() {
    return this.clientRequestInterceptor;
  }

  responseInterceptor() {
    return this.clientResponseInterceptor;
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

  async get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await this.client.get<TResponse>(url, config);
      return response;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async post<TRequest>(url: string, data: TRequest, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await this.client.post(url, data, config);
      return response;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async patch<TRequest>(url: string, data: TRequest, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const res = await this.client.patch(url, data, config);
      return res.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async put<TRequest>(url: string, data: TRequest, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await this.client.put(url, data, config);
      return response;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await this.client.delete(url, config);
      return response;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}

export default new axiosClient();
