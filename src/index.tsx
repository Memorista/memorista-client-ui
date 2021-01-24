import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { CachePolicies, IncomingOptions, Provider } from 'use-http';
import { App } from './App';
import './i18n';
import { MemoristaConfig } from './models/config';

export const init = (config: MemoristaConfig) => {
  const defaultConfig: MemoristaConfig = {
    container: document.getElementById('memorista-root'),
    apiBaseUrl: 'https://api.memorista.io/v1',
    apiKey: '',
  };

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
