import { ApolloProvider } from '@apollo/client/react';
import { ErrorBoundary, Provider as ProviderRollbar } from '@rollbar/react';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ProviderRedux } from 'react-redux';

import { initializeApp } from '@Config/initializeApp';
// eslint-disable-next-line perfectionist/sort-imports -- Redux must initialize before App
import FallbackUi from '@Components/ui/FallbackUi';

import '@Sass/global-imports.scss';
import { ServicesContext } from '@Context/servicesContext';
import ApolloClient from '@Graphql/ApolloClient';
import Rollbar from '@Lib/rollbar';

import { routeTree } from './routeTree.gen';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({ routeTree });

const { coreServices, reduxStore } = await initializeApp();

const container = document.querySelector('#root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <ProviderRollbar instance={Rollbar}>
      <ErrorBoundary level="critical" fallbackUI={FallbackUi}>
        <ProviderRedux store={reduxStore}>
          <ApolloProvider client={ApolloClient}>
            <ServicesContext.Provider value={{ serviceHttp: coreServices.serviceHttp }}>
              <RouterProvider router={router} />
            </ServicesContext.Provider>
          </ApolloProvider>
        </ProviderRedux>
      </ErrorBoundary>
    </ProviderRollbar>
  </StrictMode>
);
