import React from 'react'
import { render } from 'react-dom'
import Modal from 'react-modal'
import { Provider as ReactAlert, positions } from 'react-alert'

import 'rc-slider/assets/index.css'
import './index.css'

import App from '@/App'
import Alert from '@/components/Alert'
import { Provider as Config } from '@/context/Config'
import { Provider as User } from '@/context/User'
import { Provider as Socket } from '@/context/Socket'
import { Provider as Action } from '@/context/Action'
import { Provider as Chat } from '@/context/Chat'

Modal.setAppElement('#root')

const reactAlertOptions = {
  position: positions.TOP_LEFT,
  timeout: 5000,
}

render(
  <Chat>
    <ReactAlert template={Alert} {...reactAlertOptions}>
      <Config>
        <User>
          <Action>
            <Socket>
              <App />
            </Socket>
          </Action>
        </User>
      </Config>
    </ReactAlert>
  </Chat>,
  document.getElementById('root')
)
