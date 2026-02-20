import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import type { ReduxRootState, ReduxStore, ThunkExtra } from '@Redux/store';
import type { IServiceHttp } from '@Services/serviceHttp';

import { ApolloProvider } from '@apollo/client/react';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ServicesContext } from '@Context/servicesContext';
import ApolloClient from '@Graphql/ApolloClient';
import { AxiosClient } from '@Lib/axios';
import rootReducer from '@Redux/reducers/rootReducer';
import { ServiceHttp } from '@Services/serviceHttp';

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

type ProviderOptions = {
  withRouter?: boolean;
  withRedux?: boolean;
  withApollo?: boolean;
  withServices?: boolean;
};

type ExtendedRenderOptions = {
  preloadedState?: Partial<ReduxRootState>;
  store?: ReduxStore;
  serviceHttp?: IServiceHttp;
  providers?: ProviderOptions;
} & RenderOptions;

interface RenderWithProvidersResult extends RenderResult {
  store?: ReduxStore;
  serviceHttp?: IServiceHttp;
}

export function renderWithAllProviders(
  ui: React.ReactElement,
  options: ExtendedRenderOptions = {}
): RenderWithProvidersResult {
  const { providers = {}, ...renderOptions } = options;
  const { withApollo = false, withRedux = false, withRouter = false, withServices = false } = providers;

  const serviceHttp =
    withServices || withRedux ? (options.serviceHttp ?? new ServiceHttp(new AxiosClient())) : undefined;

  const store = withRedux && serviceHttp ? setupReduxStore({ serviceHttp }, options.preloadedState ?? {}) : undefined;

  const AllProviders = ({ children }: PropsWithChildren) => {
    let wrapped = children;

    if (withServices && serviceHttp) {
      wrapped = <ServicesContext.Provider value={{ serviceHttp }}>{wrapped}</ServicesContext.Provider>;
    }

    if (withApollo) {
      wrapped = <ApolloProvider client={ApolloClient}>{wrapped}</ApolloProvider>;
    }

    if (withRedux && store) {
      wrapped = <Provider store={store}>{wrapped}</Provider>;
    }

    if (withRouter) {
      wrapped = <BrowserRouter>{wrapped}</BrowserRouter>;
    }

    return wrapped;
  };

  const result = render(ui, { wrapper: AllProviders, ...renderOptions });

  return { ...result, serviceHttp, store } as typeof result & {
    serviceHttp?: IServiceHttp;
    store?: ReduxStore;
  };
}
