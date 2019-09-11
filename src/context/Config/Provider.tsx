import React, { useState, useEffect } from 'react'

import Context from './context'

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
    <Context.Provider value={value}>
      {value == null ? null : props.children}
    </Context.Provider>
  )
}

export default ConfigProvider
