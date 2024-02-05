import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/sass/global-imports.scss';
import App from './components/App';
// import * as serviceWorker from './serviceWorker';

const container = document.querySelector('#root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
