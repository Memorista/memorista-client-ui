import 'antd/dist/antd.css';
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
    <Provider url={config.apiBaseUrl}>
      <App />
    </Provider>,
    config.container
  );
};
