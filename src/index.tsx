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
  const options = {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
  };

  ReactDOM.render(
    <Provider url={config.apiBaseUrl} options={options}>
      <App config={config} />
    </Provider>,
    config.container
  );
};
