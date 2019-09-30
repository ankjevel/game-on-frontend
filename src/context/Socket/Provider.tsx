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
    userListen: false,
    actionListen: false,
  })

  const resetGroup = async () => {
    if (socket && socket.emit) {
      await socket.emit('group:leave')
      await socket.off('update:group')
      await socket.off('user:joined')
      await socket.off('user:left')
      await socket.off('update:action')
      for (const sub of socket.subs) {
        await sub.destroy()
      }
    }

    await setValue(state => ({
      ...state,
      userListen: false,
      actionListen: false,
      room: '',
    }))
  }

  useEffect(() => {
    if (socket != null || value.id !== '') return

    socket = io(cConfig.api)

    socket.on('connect', () => {
      setValue(state => ({
        ...state,
        id: socket.id,
        connected: true,
      }))
    })

    socket.on('reconnect', async () => {
      await resetGroup()
      setValue(state => ({ ...state, room: '', connected: false }))
    })

    return () => {
      if (value.id === '' && socket != null) {
        socket.close()
        socket = undefined
      }
    }
  }, [cConfig.api])

  useEffect(() => {
    if (socket == null) return
    if (cUser == null) return
    if (value.connected === false) return
    if (value.userListen) return

    socket.on('update:group', (updatedGroup: Group) => {
      if (cUser) {
        cUser.setValue('group', updatedGroup)
      }

      if (cAction.id === null) {
        cAction.refresh('action')
      }
    })

    socket.on('user:joined', message => {
      alert.show(`user ${message.name} joined`)
    })

    socket.on('user:left', message => {
      alert.show(`user ${message.name} left`)
    })

    setValue(state => ({ ...state, userListen: true }))
  }, [cUser, cAction.id, value.connected, value.userListen])

  useEffect(() => {
    if (socket == null) return
    if (value.connected === false) return
    if (value.actionListen) return
    if (cAction.id == null) return

    socket.on('update:action', (updatedAction: Action) => {
      cAction.setValue('action', updatedAction)
    })

    setValue(state => ({ ...state, actionListen: true }))
  }, [cAction, cAction.id, value.connected, value.actionListen])

  useEffect(() => {
    const exec = async () => {
      if (value.connected === false) return
      if (value.userSet === false) return

      if (cUser.group == null) {
        if (value.room !== '') {
          await resetGroup()
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

      setValue(state => ({ ...state, room: cUser.group.id }))
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
        if (value.userListen) return
        if (value.actionListen) return

        await socket.emit('user:join', token)
      } else {
        await socket.emit('user:leave', token)
      }

      setValue(state => ({ ...state, userSet: !!token }))
    }

    handleToken()
  }, [
    cUser,
    cUser.token,
    value.connected,
    value.userListen,
    value.actionListen,
  ])

  return (
    <Context.Provider value={value}>
      {value == null || !value.id ? null : props.children}
    </Context.Provider>
  )
}

export default SocketProvider
