import React, { Component } from 'react'

import ConfigContext from '../../context/ConfigContext'

import './App.css'

class App extends Component {
  static contextType = ConfigContext

  render() {
    if (this.context == null) {
      return null
    }

    return (
      <div className="app">
        <div className="flex mb-4">
          <code className="app-title">{`${JSON.stringify(
            this.context,
            null,
            2
          )}`}</code>
        </div>
      </div>
    )
  }
}

export default App
