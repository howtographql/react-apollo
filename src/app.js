import { action, observable } from 'mobx';
import { observer } from 'mobx-react'
import React from 'react'


@observer
export class App extends React.Component {
  render() {
    return <h1>Welcome to my app</h1>
  }
}
