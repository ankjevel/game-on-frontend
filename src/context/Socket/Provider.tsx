import { Action } from 'CAction'
import { Group } from 'Api'
import CContext from 'CSocket'

import React, { useState, useEffect, useContext } from 'react'
import io from 'socket.io-client'

import Context from './context'
import ActionContext, { Context as CAction } from '../Action'
import ConfigContext, { Context as CConfig } from '../Config'
import UserContext, { Context as CUser } from '../User'

let socket
export const SocketProvider = props => {
  const cConfig = useContext<CConfig>(ConfigContext)
  const cUser = useContext<CUser>(UserContext)
  const cAction = useContext<CAction>(ActionContext)
  const [value, setValue] = useState<CContext>({
    id: '',
    room: '',
    connected: false,
  })

  useEffect(() => {
    if (socket != null) {
      return
    }

    socket = io(cConfig.api)
    socket.on('connect', () =>
      setValue(state => ({ ...state, id: socket.id, connected: true }))
    )
    socket.on('reconnect', () =>
      setValue(state => ({ ...state, room: '', connected: false }))
    )
    socket.on('user:joined', _message => {})
    return () => {
      socket.close()
    }
  }, [cConfig.api])

  useEffect(() => {
    if (socket == null) return
    if (socket.off) socket.off('update:group')
    if (cUser == null) return

    socket.on('update:group', (updatedGroup: Group) => {
      if (cUser && cUser.group != null && cUser.group.id === updatedGroup.id) {
        cUser.setValue('group', updatedGroup)
      }
    })
  }, [cConfig.api, cUser])

  useEffect(() => {
    if (socket == null) return
    if (socket.off) socket.off('update:action')
    if (cAction == null) return

    socket.on('update:action', (updatedAction: Action) => {
      if (
        cAction &&
        cAction.action != null &&
        cAction.action.id === updatedAction.id
      ) {
        cAction.setValue('action', updatedAction)
      }
    })
  }, [cConfig.api, cAction])

  useEffect(() => {
    const exec = async () => {
      if (value.connected === false) {
        return
      }

      if (cUser.group == null) {
        if (value.room !== '') {
          await socket.emit('group:leave')
        }

        return
      }

      if (cUser.group.id === value.room) {
        return
      }

      await socket.emit('group:join', {
        id: cUser.group.id,
        token: cUser.token,
      })

      setValue(state => ({
        ...state,
        room: cUser.group.id,
      }))
    }

    exec()
  }, [cConfig.api, cUser.group, cUser.token, value.room, value.connected])

  useEffect(() => {
    const handleToken = async () => {
      const { token } = cUser
      if (token) {
        await socket.emit('user:join', token)
      } else {
        await socket.emit('user:leave', token)
      }
    }

    handleToken()
  }, [cConfig.api, cUser, cUser.token])

  return (
    <Context.Provider value={value}>
      {value == null || !value.id ? null : props.children}
    </Context.Provider>
  )
}

export default SocketProvider
