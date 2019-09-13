import CContext from './Types'

import React, { useState, useEffect } from 'react'
import * as api from '../../utils/api'
import Context from './context'

export const ConfigProvider = props => {
  const [value, setValue] = useState<CContext>()

  useEffect(() => {
    const initConfig = async () => {
      const config = await api.config.get()

      api.setHost(config.api)

      setValue(state => ({ ...state, ...config }))
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
