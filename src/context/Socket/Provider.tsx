import React, { useState, useEffect, useContext } from 'react'
import io from 'socket.io-client'

import Context from './context'
import ConfigContext from '../Config'

let socket

export const SocketProvider = props => {
  const config = useContext(ConfigContext)
  const [value, setValue] = useState({ id: '', room: '' })

  useEffect(() => {
    socket = io(config.api)

    socket.on('connect', () => {
      setValue(state => ({
        ...state,
        id: socket.id,
      }))
    })
  }, [])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default SocketProvider
