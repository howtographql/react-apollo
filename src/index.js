import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { AUTH_TOKEN } from './constants';

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  WebSocketLink
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

// const wsLink = new WebSocketLink({
//   uri: `ws://localhost:4000`,
//   options: {
//     reconnect: true,
//     connectionParams: {
//       authToken: localStorage.getItem(AUTH_TOKEN)
//     }
//   }
// });

// const link = split(
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query);
//     return (
//       kind === 'OperationDefinition' &&
//       operation === 'subscription'
//     );
//   },
//   wsLink,
//   authLink.concat(httpLink)
// );

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);
serviceWorker.unregister();
