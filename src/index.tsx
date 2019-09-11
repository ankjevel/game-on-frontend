import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './components/App'
import ConfigProvider from './providers/Config'

render(
  <ConfigProvider>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
)
