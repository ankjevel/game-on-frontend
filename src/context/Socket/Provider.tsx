import React, { useState, useEffect, useContext } from 'react'
import io from 'socket.io-client'

import Context from './context'
import ConfigContext from '../Config'

export const SocketProvider = props => {
  let socket
  const config = useContext(ConfigContext)
  const [value, setValue] = useState()

  useEffect(() => {
    console.log(config)
    socket = io(config.api)
    const initConfig = async () => {
      console.log('init socket', socket)

      setValue(state => ({
        ...state,
      }))
    }

    initConfig()
  }, [])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default SocketProvider
