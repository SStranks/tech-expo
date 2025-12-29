import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import type { AxiosClient } from '@Lib/axios';
import type { ReduxAuthStateAdapter } from '@Redux/adapters/reduxAuthAdapter';

import { ApiResponseSuccess } from '@Shared/src/types/api/base';
import AppError from '@Utils/AppError';

interface Request {
  config: AxiosRequestConfig<any>;
}

class ServiceAuth {
  private AuthState: ReduxAuthStateAdapter;
  private ApiClient: AxiosClient;
  private PendingRequests: number;
  private RequestQueue: Request[];
  private MaxRequests: number;
  private MaxRetry = 5;
  private CurrentRetry = 0;
  private Data: unknown;

  constructor(apiClient: AxiosClient, authState: ReduxAuthStateAdapter) {
    this.AuthState = authState;
    this.ApiClient = apiClient;
    this.PendingRequests = 0;
    this.RequestQueue = [];
    this.MaxRequests = 5;
    this.MaxRetry = 4;
    this.CurrentRetry = 0;
    this.Data = undefined;
  }

  private canRequestAuthToken(): boolean {
    return this.AuthState.isAuthTokenPending();
  }

  private authInterceptorSuccess = (response: AxiosResponse<ApiResponseSuccess>) => {
    this.Data = this.ApiClient.responseData(response);

    if (this.Data && typeof this.Data === 'object' && 'tokens' in this.Data) {
      this.activateRefreshToken();
    }

    return response;
  };

  private authInterceptorFailure = async (error: any) => {
    const prevRequest = error?.config;

    // If unauthorized; try for new auth token and then retry request
    if (error.response && error.response?.status === 401 && !prevRequest._retry) {
      prevRequest._retry = true;
      if (!this.canRequestAuthToken()) {
        try {
          // Get new authToken
          await this.getAuthToken();
          // Retry all queued requests
          this.RequestQueue.forEach(({ config }) => {
            this.ApiClient.retryRequest(config);
          });
          // Clear request queue
          this.clearQueue();
          // Retry original request
          const response = await this.ApiClient.retryRequest(prevRequest);
          return response;
        } catch (error) {
          console.log(error);
          // Refresh authToken failure: Clear request queue, logout
          this.clearQueue();
          this.AuthState.clearAuth();
          throw error;
        }
      }

      // Add original request to queue
      if (this.PendingRequests < this.MaxRequests) {
        this.pushQueue(prevRequest);
      }
    }

    // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
    return Promise.reject(error);
  };

  private clearQueue() {
    this.PendingRequests = 0;
    this.RequestQueue = [];
  }

  private pushQueue(config: AxiosRequestConfig<any>) {
    this.RequestQueue.push({ config });
  }

  private async getAuthToken() {
    try {
      this.AuthState.setRefreshTokenActivated(false);
      this.AuthState.setRefreshTokenPending(true);
      this.AuthState.setAuthTokenPending(true);
      await this.ApiClient.get('/api/users/generateAuthToken', { withCredentials: true });
      this.CurrentRetry = 0;
    } catch (error) {
      if (error instanceof AppError && error.message === 'No response received from server') {
        if (this.CurrentRetry < this.MaxRetry) {
          this.CurrentRetry++;
          await new Promise((resolve) => {
            setTimeout(() => resolve(null), 2 ** this.CurrentRetry * 600);
          });
          this.getAuthToken();
        } else {
          // Unauthorized
          this.AuthState.clearAuth();
        }
      }
      if (error instanceof AppError && error.message === 'Please verify Refresh Token') {
        return this.activateRefreshToken();
      }
      // Unspecified error; force logout state
      this.AuthState.clearAuth();
    } finally {
      this.AuthState.setAuthTokenPending(false);
    }
  }

  public async activateRefreshToken() {
    try {
      await this.ApiClient.get('/api/users/activateRefreshToken', { withCredentials: true });
      this.CurrentRetry = 0;
      this.AuthState.setRefreshTokenActivated(true);
      this.AuthState.setRefreshTokenPending(false);
    } catch (error: any) {
      if (error.message === 'Token already activated') {
        this.AuthState.setRefreshTokenActivated(true);
        this.AuthState.setRefreshTokenPending(false);
        return;
      }
      if (this.CurrentRetry < this.MaxRetry) {
        this.CurrentRetry++;
        await new Promise((resolve) => {
          setTimeout(
            () => {
              resolve(this.activateRefreshToken());
            },
            2 ** this.CurrentRetry * 500
          );
        });
      } else {
        // Retry process at 5min intervals; Auth Token valid for 15.
        setTimeout(() => this.activateRefreshToken(), 1000 * 60 * 4.9);
      }
    }
  }

  public async initInterceptors() {
    this.ApiClient.responseInterceptor().use(this.authInterceptorSuccess, this.authInterceptorFailure);
  }
}

export default ServiceAuth;
