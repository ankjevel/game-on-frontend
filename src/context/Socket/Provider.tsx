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
  }, [config.api])

  useEffect(() => {
    const exec = async () => {
      if (user.group === '') {
        if (value.room !== '') {
          await socket.emit('leave', value.room)
        }

        return
      }

      console.log('call when USE EFFECT', JSON.stringify(user), value.room)
    }

    exec()
  }, [user, value.room])

  return (
    <Context.Provider value={value}>
      {value == null || !value.id ? null : props.children}
    </Context.Provider>
  )
}

export default SocketProvider
