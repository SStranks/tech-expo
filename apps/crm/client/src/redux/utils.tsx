import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import type { ReduxRootState, ReduxStore, ThunkExtra } from './store';

import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { AxiosClient } from '@Lib/axios';
import { ServiceHttp } from '@Services/serviceHttp';

import rootReducer from './reducers/rootReducer';

const axiosClient = new AxiosClient();
const serviceHttp = new ServiceHttp(axiosClient);

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<ReduxRootState>;
  store?: ReduxStore;
}

interface RenderWithProvidersResult extends RenderResult {
  store: ReduxStore;
}

const setupReduxStore = (extra: ThunkExtra, preloadedState?: Partial<ReduxRootState>) => {
  return configureStore({
    preloadedState,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: extra,
        },
      }),
  });
};

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
): RenderWithProvidersResult {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupReduxStore({ serviceHttp }, preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>;

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  // Return an object with the store and all of RTL's query functions
  return Object.assign(result, { store });
}
