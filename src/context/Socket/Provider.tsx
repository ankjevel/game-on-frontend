import React, { useState, useEffect, useContext } from 'react'
import io from 'socket.io-client'
import Context from './context'
import ConfigContext from '../Config'
import UserContext from '../User'

export let socket
export const SocketProvider = props => {
  const config = useContext(ConfigContext)
  const user = useContext(UserContext)
  const [value, setValue] = useState({ id: '', room: '' })

  useEffect(() => {
    if (socket != null) {
      return
    }

    socket = io(config.api)
    socket.on('connect', () => {
      setValue(state => ({ ...state, id: socket.id }))
    })

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    const handleUserID = async () => {
      if (user.id === '') {
        if (value.room !== '') {
          await socket.emit('leave', value.room)
        }

        return
      }

      console.log('call when USE EFFECT', JSON.stringify(user), value.room)
    }

    handleUserID()
  }, [user.id])

  return (
    <Context.Provider value={value}>
      {value == null || !value.id ? null : props.children}
    </Context.Provider>
  )
}

export default SocketProvider
