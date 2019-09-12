import CContext from './Types'
import { CConfig } from 'CConfig'
import React, { useState, useEffect, useContext } from 'react'
import io from 'socket.io-client'
import Context from './context'
import ConfigContext from '../Config'
import UserContext, { Context as User } from '../User'

export let socket
export const SocketProvider = props => {
  const config = useContext<CConfig>(ConfigContext)
  const user = useContext<User>(UserContext)
  const [value, setValue] = useState<CContext>({
    id: '',
    room: '',
    connected: false,
  })

  useEffect(() => {
    if (socket != null) {
      return
    }

    socket = io(config.api)
    socket.on('connect', () => {
      setValue(state => ({ ...state, id: socket.id, connected: true }))
    })

    socket.on('reconnect', () => {
      setValue(state => ({ ...state, room: '', connected: false }))
    })

    return () => {
      socket.close()
    }
  }, [config.api])

  useEffect(() => {
    const exec = async () => {
      if (value.connected === false) {
        return
      }

      if (user.group == null) {
        if (value.room !== '') {
          console.log('useEffect: leave group')
          await socket.emit('group:leave')
        }

        return
      }

      if (user.group.id === value.room) {
        return
      }

      await socket.emit('group:join', user.group.id)
      setValue(state => ({
        ...state,
        room: user.group.id,
      }))
    }

    exec()
  }, [user.group, value.room, value.connected])

  return (
    <Context.Provider value={value}>
      {value == null || !value.id ? null : props.children}
    </Context.Provider>
  )
}

export default SocketProvider
