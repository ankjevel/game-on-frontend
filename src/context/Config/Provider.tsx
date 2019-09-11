import React, { useState, useEffect } from 'react'
import req, { setHost } from '../../utils/req'
import Context from './context'
import CConfig from 'CConfig'

export const ConfigProvider = props => {
  const [value, setValue] = useState()

  useEffect(() => {
    const initConfig = async () => {
      const config = await req({
        url: '/js/config.json',
      })

      setHost(config.api)

      setValue((state: MaybeNull<CConfig>) => ({
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
