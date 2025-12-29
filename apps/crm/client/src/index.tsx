import { ApolloProvider } from '@apollo/client/react';
import { ErrorBoundary, Provider as ProviderRollbar } from '@rollbar/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ProviderRedux } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { initializeApp } from '@Config/initializeApp';
// eslint-disable-next-line perfectionist/sort-imports -- Redux must initialize before App
import App from '@Components/App';
import FallbackUi from '@Components/ui/FallbackUi';

import '@Sass/global-imports.scss';
import { ServicesContext } from '@Context/servicesContext';
import ApolloClient from '@Graphql/ApolloClient';
import Rollbar from '@Lib/rollbar';

const { coreServices, reduxStore } = await initializeApp();

const container = document.querySelector('#root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <ProviderRollbar instance={Rollbar}>
      <ErrorBoundary level="critical" fallbackUI={FallbackUi}>
        <BrowserRouter>
          <ProviderRedux store={reduxStore}>
            <ApolloProvider client={ApolloClient}>
              <ServicesContext.Provider value={{ serviceHttp: coreServices.serviceHttp }}>
                <App />
              </ServicesContext.Provider>
            </ApolloProvider>
          </ProviderRedux>
        </BrowserRouter>
      </ErrorBoundary>
    </ProviderRollbar>
  </StrictMode>
);
