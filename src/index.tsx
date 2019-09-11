import React from 'react'
import { render } from 'react-dom'
import './index.css'

import App from './components/App'

import { Provider as ConfigProvider } from './context/Config'

render(
  <ConfigProvider>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
)
