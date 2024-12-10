import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import axiosClient, { type IAxiosClient } from '@Lib/axios';
import {
  clearAuthState,
  setAuthTokenPending,
  setRefreshTokenActivated,
  setRefreshTokenPending,
} from '@Redux/reducers/authSlice';
import ReduxStore from '@Redux/store';
import AppError from '@Utils/AppError';

interface IRequest {
  config: AxiosRequestConfig<any>;
}

class ServiceAuth {
  private ApiClient: IAxiosClient;
  private PendingRequests: number;
  private RequestQueue: IRequest[];
  private MaxRequests: number;
  private MaxRetry = 5;
  private CurrentRetry = 0;

  constructor(apiClient: IAxiosClient) {
    this.ApiClient = apiClient;
    this.ApiClient.responseInterceptor().use(this.authInterceptorSuccess, this.authInterceptorFailure);
    this.PendingRequests = 0;
    this.RequestQueue = [];
    this.MaxRequests = 5;
    this.MaxRetry = 4;
    this.CurrentRetry = 0;
  }

  private authInterceptorSuccess = (response: AxiosResponse) => {
    if (response?.data?.tokens) {
      this.activateRefreshToken();
    }
    return response;
  };

  private authInterceptorFailure = async (error: any) => {
    const prevRequest = error?.config;

    // If unauthorized; try for new auth token and then retry request
    if (error.response && error.response?.status === 401 && !prevRequest._retry) {
      prevRequest._retry = true;
      if (!ReduxStore.getState().auth.authTokenPending) {
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
          ReduxStore.dispatch(clearAuthState());
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
      ReduxStore.dispatch(setRefreshTokenActivated(false));
      ReduxStore.dispatch(setRefreshTokenPending(true));
      ReduxStore.dispatch(setAuthTokenPending(true));
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
          ReduxStore.dispatch(clearAuthState());
        }
      }
      if (error instanceof AppError && error.message === 'Please verify Refresh Token') {
        return this.activateRefreshToken();
      }
      // Unspecified error; force logout state
      ReduxStore.dispatch(clearAuthState());
    } finally {
      ReduxStore.dispatch(setAuthTokenPending(false));
    }
  }

  public async activateRefreshToken() {
    try {
      await this.ApiClient.get('/api/users/activateRefreshToken', { withCredentials: true });
      this.CurrentRetry = 0;
      ReduxStore.dispatch(setRefreshTokenActivated(true));
      ReduxStore.dispatch(setRefreshTokenPending(false));
    } catch (error: any) {
      if (error.message === 'Token already activated') {
        ReduxStore.dispatch(setRefreshTokenActivated(true));
        ReduxStore.dispatch(setRefreshTokenPending(false));
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
}

export default new ServiceAuth(axiosClient);
