import React, { Component } from 'react'
import LinkList from './LinkList'
import CreateLink from './CreateLink'
import Header from './Header'
import { Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App