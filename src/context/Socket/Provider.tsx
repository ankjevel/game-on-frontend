import { Action } from 'CAction'
import { Group } from 'Api'
import CContext from 'CSocket'

import React, { useState, useEffect, useContext } from 'react'
import { useAlert } from 'react-alert'
import io from 'socket.io-client'

import Context from './context'
import ActionContext, { Context as CAction } from '../Action'
import ConfigContext, { Context as CConfig } from '../Config'
import UserContext, { Context as CUser } from '../User'

let socket
export const SocketProvider = props => {
  const alert = useAlert()
  const cConfig = useContext<CConfig>(ConfigContext)
  const cUser = useContext<CUser>(UserContext)
  const cAction = useContext<CAction>(ActionContext)
  const [value, setValue] = useState<CContext>({
    id: '',
    room: '',
    connected: false,
    userSet: false,
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
    return () => {
      socket.close()
    }
  }, [cConfig.api])

  useEffect(() => {
    if (socket == null) return
    if (socket.off) {
      socket.off('update:group')
      socket.off('user:joined')
      socket.off('user:left')
    }
    if (cUser == null) return

    socket.on('update:group', (updatedGroup: Group) => {
      if (cUser && cUser.group != null && cUser.group.id === updatedGroup.id) {
        cUser.setValue('group', updatedGroup)
      }

      if (cAction != null && cAction.action === null) {
        cAction.refresh('action')
      }
    })

    socket.on('user:joined', message => {
      alert.show(`user ${message.name} joined`)
    })

    socket.on('user:left', message => {
      alert.show(`user ${message.name} left`)
    })
  }, [cUser, cAction])

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
  }, [cAction, cAction.action])

  useEffect(() => {
    const exec = async () => {
      if (value.connected === false || value.userSet === false) {
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
  }, [cUser.group, cUser.token, value.room, value.connected, value.userSet])

  useEffect(() => {
    const handleToken = async () => {
      if (value.connected === false) {
        return
      }

      const { token } = cUser
      if (token) {
        await socket.emit('user:join', token)
      } else {
        await socket.emit('user:leave', token)
      }

      setValue(state => ({ ...state, userSet: !!token }))
    }

    handleToken()
  }, [cUser, cUser.token, value.connected])

  return (
    <Context.Provider value={value}>
      {value == null || !value.id ? null : props.children}
    </Context.Provider>
  )
}

export default SocketProvider
