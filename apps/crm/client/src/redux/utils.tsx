import type { RenderOptions } from '@testing-library/react';

import type { ReduxRootState, ReduxStore } from './store';

import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { AxiosClient } from '@Lib/axios';
import { ServiceHttp } from '@Services/serviceHttp';

import configureReduxStore from './store';

const axiosClient = new AxiosClient();
const serviceHttp = new ServiceHttp(axiosClient);

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<ReduxRootState>;
  store?: ReduxStore;
}

export function renderWithProviders(ui: React.ReactElement, extendedRenderOptions: ExtendedRenderOptions = {}) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureReduxStore({ serviceHttp }, preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>;

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
