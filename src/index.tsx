import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './components/App'
import { Provider as Config } from './context/Config'
import { Provider as User } from './context/User'
import { Provider as Socket } from './context/Socket'

render(
  <Config>
    <User>
      <Socket>
        <App />
      </Socket>
    </User>
  </Config>,
  document.getElementById('root')
)
