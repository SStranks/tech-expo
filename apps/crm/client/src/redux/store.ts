import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import rootReducer from './reducers/rootReducer';

let ReduxStore: EnhancedStore | undefined;

function assertReduxStore(ReduxStore: EnhancedStore | undefined): asserts ReduxStore is ReduxStore {
  if (!ReduxStore) throw new Error('Redux store not yet configured');
}

export function getReduxStore(): ReduxStore {
  assertReduxStore(ReduxStore);
  return ReduxStore;
}

export default function configureReduxStore(preloadedState?: Partial<ReduxRootState>) {
  const store = configureStore({
    preloadedState,
    reducer: rootReducer,
  });

  if (!ReduxStore) ReduxStore = store;
  return (ReduxStore as typeof store) ?? store;
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept('./reducers/rootReducer', async () => {
    try {
      const { default: newRootReducer } = await import('./reducers/rootReducer');
      assertReduxStore(ReduxStore);
      ReduxStore.replaceReducer(newRootReducer);
    } catch (error) {
      console.error('HMR reload failed for rootReducer:', error);
    }
  });
}

export type ReduxStore = ReturnType<typeof configureReduxStore>;
export type ReduxRootState = ReturnType<typeof rootReducer>;
export type ReduxDispatch = ReduxStore['dispatch'];
export type ReduxState = ReturnType<ReduxStore['getState']>;
