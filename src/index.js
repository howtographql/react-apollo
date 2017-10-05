import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import InMemoryCache from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { GC_AUTH_TOKEN } from './constants'

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__' })

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(GC_AUTH_TOKEN)

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  })

  return forward(operation)
})

const link = middlewareLink.concat(httpLink)

const client = new ApolloClient({
  link: link,
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
