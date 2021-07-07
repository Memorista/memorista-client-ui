import 'antd/dist/antd.css';
import { FunctionComponent } from 'preact';
import register from 'preact-custom-element';
import { CachePolicies, IncomingOptions, Provider } from 'use-http';
import { App } from './App';
import './i18n';

type Props = {
  apiBaseUrl?: string;
  apiKey?: string;
};

export const Memorista: FunctionComponent<Props> = ({ apiBaseUrl = 'https://api.memorista.io/v1', apiKey = '' }) => {
  const options: IncomingOptions = {
    cachePolicy: CachePolicies.NO_CACHE,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  return (
    <Provider url={apiBaseUrl} options={options}>
      <App apiKey={apiKey} />
    </Provider>
  );
};

register(Memorista, 'x-memorista', ['api-base-url', 'api-key']);
