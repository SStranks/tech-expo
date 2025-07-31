/* eslint-disable perfectionist/sort-imports */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

// NOTE:  Redux to initialize before App.
import ReduxStore from '@Redux/store';
import App from '@Components/App';

import '@Sass/global-imports.scss';
import { authInitialize } from '@Redux/reducers/authSlice';
import ApolloClient from '@Graphql/ApolloClient';

ReduxStore.dispatch(authInitialize());

// TODO:  Connect global error to Rollbar
// eslint-disable-next-line unicorn/prefer-add-event-listener
globalThis.onerror = function (message, source, lineno, colno, error) {
  // Log the error details or send them to a logging service
  console.error('Error:', message);
  console.error('Source:', source);
  console.error('Line Number:', lineno);
  console.error('Column Number:', colno);
  console.error('Error Object:', error);

  // Return true to prevent the default browser error handling
  return true;
};

const container = document.querySelector('#root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={ReduxStore}>
        <ApolloProvider client={ApolloClient}>
          <App />
        </ApolloProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

// Webpack; Hot-Module-Reload
if (module.hot) {
  module.hot.accept('./components/App', async () => {
    const { default: AppHMR } = await import('./components/App');
    root.render(
      <StrictMode>
        <BrowserRouter>
          <Provider store={ReduxStore}>
            <AppHMR />
          </Provider>
        </BrowserRouter>
      </StrictMode>
    );
  });
}
