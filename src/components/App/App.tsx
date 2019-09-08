import React, { Component } from 'react'
import { Config } from 'config'

import './App.css'

class App extends Component {
  state: { config: MaybeNull<Config> } = {
    config: null,
  }

  componentDidMount() {
    fetch('/js/config.json')
      .then(res => res.json())
      .then((config: Config) => {
        this.setState({
          ...this.state,
          config,
        })
      })
  }

  render() {
    if (this.state.config == null) {
      return null
    }

    return (
      <div className="app">
        <div className="flex mb-4">
          <code className="app-title">{`${JSON.stringify(
            this.state.config,
            null,
            2
          )}`}</code>
        </div>
      </div>
    )
  }
}

export default App
