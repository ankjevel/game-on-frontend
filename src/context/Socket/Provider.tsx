import React, { useState, useEffect, useContext } from 'react'
import io from 'socket.io-client'
import Context from './context'
import ConfigContext from '../Config'
import UserContext from '../User'

let socket
export const SocketProvider = props => {
  const config = useContext(ConfigContext)
  const user = useContext(UserContext)
  const [value, setValue] = useState({ id: '', room: '' })

  useEffect(() => {
    socket = io(config.api)

    socket.on('connect', () => {
      setValue(state => ({
        ...state,
        id: socket.id,
      }))

      console.log(user)
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <Context.Provider value={value}>
      {value == null || !value.id ? null : props.children}
    </Context.Provider>
  )
}

export default SocketProvider
