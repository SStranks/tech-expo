import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/sass/global-imports.scss';
import App from './components/App';

const container = document.querySelector('#root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
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
          <AppHMR />
        </BrowserRouter>
      </StrictMode>
    );
  });
}
