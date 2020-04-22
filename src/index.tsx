import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'use-http';
import App from './App';
import './I18n';

export interface GuestyConfig {
  container: Element | null;
  apiBaseUrl: string;
  apiKey: string;
}

const defaultConfig: GuestyConfig = {
  container: document.getElementById('guesty-root'),
  apiBaseUrl: 'http://localhost:3000',
  apiKey: '',
};

export const init = (config: GuestyConfig) => {
  const mergedConfig = { ...defaultConfig, ...config };

  const options = {
    headers: {
      Authorization: `Bearer ${mergedConfig.apiKey}`,
    },
  };

  ReactDOM.render(
    <Provider url={mergedConfig.apiBaseUrl} options={options}>
      <App config={mergedConfig} />
    </Provider>,
    mergedConfig.container
  );
};
