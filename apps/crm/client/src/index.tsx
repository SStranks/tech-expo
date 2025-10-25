/* eslint-disable perfectionist/sort-imports */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ProviderRedux } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { ErrorBoundary, Provider as ProviderRollbar } from '@rollbar/react';

// NOTE:  Redux to initialize before App.
import Rollbar from '@Lib/rollbar';
import ReduxStore from '@Redux/store';
import App from '@Components/App';

import '@Sass/global-imports.scss';
import { globalErrorHandler } from '@Config/globalOnError';
import ApolloClient from '@Graphql/ApolloClient';
import { authInitialize } from '@Redux/reducers/authSlice';
import { FallbackUi } from '@Components/index';

// Initialization
globalErrorHandler();
ReduxStore.dispatch(authInitialize());

const container = document.querySelector('#root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <ProviderRollbar instance={Rollbar}>
      <ErrorBoundary level="critical" fallbackUI={FallbackUi}>
        <BrowserRouter>
          <ProviderRedux store={ReduxStore}>
            <ApolloProvider client={ApolloClient}>
              <App />
            </ApolloProvider>
          </ProviderRedux>
        </BrowserRouter>
      </ErrorBoundary>
    </ProviderRollbar>
  </StrictMode>
);

// Webpack; Hot-Module-Reload
if (module.hot) {
  module.hot.accept('./components/App', async () => {
    const { default: AppHMR } = await import('./components/App');
    root.render(
      <StrictMode>
        <BrowserRouter>
          <ProviderRedux store={ReduxStore}>
            <AppHMR />
          </ProviderRedux>
        </BrowserRouter>
      </StrictMode>
    );
  });
}
