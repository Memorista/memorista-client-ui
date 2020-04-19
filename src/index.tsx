import 'bootswatch/dist/cosmo/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'use-http';
import App from './App';

interface GuestyConfig {
  container: Element | null;
  apiBaseUrl: string;
}

export const init = (config: GuestyConfig) => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider url={config.apiBaseUrl}>
        <App />
      </Provider>
    </React.StrictMode>,
    config.container
  );
};
