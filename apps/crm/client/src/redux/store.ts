import type { Action, ThunkDispatch } from '@reduxjs/toolkit';

import type { IServiceHttp } from '@Services/serviceHttp';

import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './reducers/rootReducer';

export type ThunkExtra = {
  serviceHttp: IServiceHttp;
};

export type AppThunkApiConfig = {
  state: ReduxRootState;
  dispatch: ReduxDispatch;
  extra: ThunkExtra;
};

let storeExists: boolean = false;
let reduxStore: ReduxStore | undefined;

function assertReduxStore(reduxStore: ReduxStore | undefined): asserts reduxStore is ReduxStore {
  if (!reduxStore) throw new Error('Redux store not yet configured');
}

export function getReduxStore() {
  assertReduxStore(reduxStore);
  return reduxStore;
}

export default function configureReduxStore(extra: ThunkExtra, preloadedState?: Partial<ReduxRootState>) {
  if (storeExists) throw new Error('Redux store already configured. Return store with getReduxStore()');

  const store = configureStore({
    preloadedState,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: extra,
        },
      }),
  });

  storeExists = true;
  reduxStore = store;
  return store;
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept('./reducers/rootReducer', () => {
    import('./reducers/rootReducer')
      .then(({ default: newRootReducer }) => {
        assertReduxStore(reduxStore);
        reduxStore.replaceReducer(newRootReducer);
      })
      .catch((error) => {
        console.error('HMR reload failed for rootReducer:', error);
      });
  });
}

export type ReduxStore = ReturnType<typeof configureReduxStore>;
export type ReduxRootState = ReturnType<typeof rootReducer>;
export type ReduxDispatch = ThunkDispatch<ReduxRootState, ThunkExtra, Action>;
export type ReduxState = ReturnType<ReduxStore['getState']>;
