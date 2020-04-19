import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'use-http';
import App from './App';
import Theme from './Theme';

interface GuestyConfig {
  container: Element | null;
  apiBaseUrl: string;
}

export const init = (config: GuestyConfig) => {
  ReactDOM.render(
    <React.StrictMode>
      <Theme />
      <Provider url={config.apiBaseUrl}>
        <App />
      </Provider>
    </React.StrictMode>,
    config.container
  );
};
