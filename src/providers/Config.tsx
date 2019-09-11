import React, { useState, useEffect } from 'react'

import ConfigContext from '../context/Config'

export const ConfigProvider = props => {
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
      {value == null ? null : props.children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
