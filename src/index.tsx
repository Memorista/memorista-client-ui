import { ChakraProvider } from '@chakra-ui/react';
import { FunctionComponent } from 'preact';
import register from 'preact-custom-element';
import { CachePolicies, IncomingOptions, Provider as HttpProvider } from 'use-http';
import { App } from './App';
import './i18n';

type Props = {
  apiBaseUrl?: string;
  apiKey?: string;
};

const Memorista: FunctionComponent<Props> = ({ apiBaseUrl = 'https://api.memorista.io/v2', apiKey = '' }) => {
  const options: IncomingOptions = {
    cachePolicy: CachePolicies.NO_CACHE,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  return (
    <HttpProvider url={apiBaseUrl} options={options}>
      <ChakraProvider>
        <App apiKey={apiKey} />
      </ChakraProvider>
    </HttpProvider>
  );
};

register(Memorista, 'x-memorista', ['api-base-url', 'api-key']);
