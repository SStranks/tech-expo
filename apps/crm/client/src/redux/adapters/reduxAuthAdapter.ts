import type { ReduxStore } from '@Redux/store';

import {
  clearAuthState,
  selectorAuthTokenPending,
  setAuthTokenPending,
  setRefreshTokenActivated,
  setRefreshTokenPending,
} from '@Redux/reducers/authSlice';

export type ReduxAuthStateAdapter = ReturnType<typeof createReduxAuthAdapter>;

export function createReduxAuthAdapter(store: ReduxStore) {
  return {
    clearAuth: () => store.dispatch(clearAuthState()),

    getState: () => store.getState(),

    isAuthTokenPending: () => selectorAuthTokenPending(store.getState()),

    setAuthTokenPending: (value: boolean) => store.dispatch(setAuthTokenPending(value)),

    setRefreshTokenActivated: (value: boolean) => store.dispatch(setRefreshTokenActivated(value)),

    setRefreshTokenPending: (value: boolean) => store.dispatch(setRefreshTokenPending(value)),
  };
}
