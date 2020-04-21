import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'use-http';
import App from './App';

export interface GuestyConfig {
  container: Element | null;
  apiBaseUrl: string;
  apiKey: string;
}

export const init = (config: GuestyConfig) => {
  ReactDOM.render(
    <Provider url={config.apiBaseUrl}>
      <App config={config} />
    </Provider>,
    config.container
  );
};
