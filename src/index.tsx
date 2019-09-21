import React from 'react'
import { render } from 'react-dom'
import Modal from 'react-modal'
import 'rc-slider/assets/index.css'
import './index.css'

import App from './components/App'
import { Provider as Config } from './context/Config'
import { Provider as User } from './context/User'
import { Provider as Socket } from './context/Socket'
import { Provider as Action } from './context/Action'

Modal.setAppElement('#root')

render(
  <Config>
    <User>
      <Action>
        <Socket>
          <App />
        </Socket>
      </Action>
    </User>
  </Config>,
  document.getElementById('root')
)
