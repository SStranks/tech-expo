/* eslint-disable perfectionist/sort-imports */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ProviderRedux } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { ErrorBoundary, Provider as ProviderRollbar } from '@rollbar/react';

// NOTE:  Redux to initialize before App.
import Rollbar from '@Lib/rollbar';
import configureReduxStore from '@Redux/store';
import App from '@Components/App';

import '@Sass/global-imports.scss';
import { globalErrorHandler } from '@Config/globalOnError';
import ApolloClient from '@Graphql/ApolloClient';
import { authInitialize } from '@Redux/reducers/authSlice';
import { createCoreServices } from '@Services/servicesCore';
import { createReduxServices } from '@Services/servicesRedux';
import FallbackUi from '@Components/ui/FallbackUi';
import { ServicesContext } from '@Context/servicesContext';

// Initialization
globalErrorHandler();
const coreServices = createCoreServices();
const reduxStore = configureReduxStore({
  serviceHttp: coreServices.serviceHttp,
});
const reduxServices = createReduxServices(coreServices, reduxStore);

await reduxStore.dispatch(authInitialize());
await reduxServices.serviceAuth.initInterceptors();

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
