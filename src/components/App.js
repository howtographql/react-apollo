import React, {Component} from 'react'
import LinkList from './LinkList'
import Login from './Login'
import CreateLink from './CreateLink'
import Search from './Search'
import {Switch, Route, Redirect} from 'react-router-dom'

class App extends Component {

  render() {
    return (
      <Switch>
        <Route exact path='/' render={() => <Redirect to='/new/1' />} />
        <Route exact path='/login' component={Login}/>
        <Route exact path='/create' component={CreateLink}/>
        <Route exact path='/search' component={Search}/>
        <Route exact path='/top' component={LinkList}/>
        <Route exact path='/new/:page' component={LinkList}/>
      </Switch>
    )
  }

}

export default App
