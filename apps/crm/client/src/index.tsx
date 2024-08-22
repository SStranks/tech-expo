import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '#Components/App';
import ReduxStore from '#Redux/store';
import '#Sass/global-imports.scss';

const container = document.querySelector('#root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={ReduxStore}>
        <App />
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
