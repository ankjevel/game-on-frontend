import React, { useState, useEffect } from 'react'
import req from '../../utils/req'

import Context from './context'
import Config from 'config'

export const ConfigProvider = props => {
  const [value, setValue] = useState()

  useEffect(() => {
    const initConfig = async () => {
      const config = await req({
        url: '/js/config.json',
        host: '',
      })

      setValue((state: MaybeNull<Config>) => ({
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
