import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { CachePolicies, IncomingOptions, Provider } from 'use-http';
import { App } from './App';
import './i18n';
import { GuestyConfig } from './models/config';

const defaultConfig: GuestyConfig = {
  container: document.getElementById('guesty-root'),
  apiBaseUrl: 'http://localhost:3000',
  apiKey: '',
};

export const init = (config: GuestyConfig) => {
  const mergedConfig = { ...defaultConfig, ...config };

  const options: IncomingOptions = {
    cachePolicy: CachePolicies.NO_CACHE,
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
