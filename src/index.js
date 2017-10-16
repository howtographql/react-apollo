import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { GC_AUTH_TOKEN } from './constants'

const authMiddlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(GC_AUTH_TOKEN)

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  })

  return forward(operation)
})

const httpLink = authMiddlewareLink.concat(
  new HttpLink({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__' })
)

const wsLink = new WebSocketLink({
  uri: 'wss://subscriptions.graph.cool/v1/__PROJECT_ID__',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(GC_AUTH_TOKEN),
    }
  }
})

const hasSubscriptionOperation = ({ query: { definitions } }) =>
  definitions.some(({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription')

const client = new ApolloClient({
  link: ApolloLink.split(
    hasSubscriptionOperation,
    wsLink,
    httpLink
  ),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)

registerServiceWorker()
