import React, { Component, Fragment } from 'react'

import { Provider as Socket } from '../../context/Socket'
import { Provider as User } from '../../context/User'

import ConfigContext from '../../context/Config'

import './App.css'

class App extends Component {
  static contextType = ConfigContext

  render() {
    return (
      <Fragment>
        <Socket />
        <User />
        <div className="app">
          <div className="flex mb-4">
            <code className="app-title">{`${JSON.stringify(
              this.context,
              null,
              2
            )}`}</code>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default App
