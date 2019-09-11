import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './components/App'

import ConfigContext from './context/ConfigContext'

const ConfigProvider = props => {
  const [value, setValue] = useState()

  useEffect(() => {
    const initConfig = async () => {
      const res = await fetch('/js/config.json')
      const config = await res.json()

      setValue(state => ({
        ...state,
        ...config,
      }))
    }
    initConfig()
  }, [])

  return (
    <ConfigContext.Provider value={value}>
      {props.children}
    </ConfigContext.Provider>
  )
}

render(
  <ConfigProvider>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
)
