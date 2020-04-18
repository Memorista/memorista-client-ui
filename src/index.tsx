import 'milligram/dist/milligram.min.css';
import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'use-http';
import App from './App';
import './index.css';

interface GuestyConfig {
  container: Element | null;
  apiBaseUrl: string;
}

declare global {
  interface Window {
    guestyConfig: GuestyConfig;
  }
}

window.guestyConfig = window.guestyConfig || null;
const config: GuestyConfig = window.guestyConfig;

ReactDOM.render(
  <React.StrictMode>
    <Provider url={config.apiBaseUrl}>
      <App />
    </Provider>
  </React.StrictMode>,
  config.container
);
