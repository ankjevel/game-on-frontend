import { Action, KeyValue } from 'CAction'
import { Group } from 'Api'
import CContext, { OnMessage } from 'CSocket'

import React, { useState, useEffect, useContext } from 'react'

import { useAlert } from 'react-alert'
import io from 'socket.io-client'

import Context from './context'
import ActionContext, { Context as CAction } from '@/context/Action'
import ConfigContext, { Context as CConfig } from '@/context/Config'
import UserContext, { Context as CUser } from '@/context/User'
import ChatContext, { Context as CChat } from '@/context/Chat'

let socket
export const onMessage: OnMessage = message => {
  if (socket == null || socket.token == null) return
  socket.emit('message', {
    message,
    token: socket.token,
  })
}

export const SocketProvider = props => {
  const alert = useAlert()

  const cConfig = useContext<CConfig>(ConfigContext)
  const cUser = useContext<CUser>(UserContext)
  const cAction = useContext<CAction>(ActionContext)
  const cChat = useContext<CChat>(ChatContext)

  const [value, setValue] = useState<CContext>({
    id: socket != null ? socket.id : '',
    connected: socket != null && socket.connected,
    room: '',
    userSet: false,
    userListen: false,
    actionListen: false,
  })

  const reset: (options?: {
    destroy?: boolean
    emit?: string
    emitData?: string
    state?: { [key: string]: string | boolean }
  }) => void = async (
    options = {
      emit: 'group:leave',
    }
  ) => {
    if (options.emit) {
      await socket.emit(options.emit, options.emitData)
    }

    if (!options.destroy) {
      for (const key of [
        'update:action',
        'update:group',
        'user:joined',
        'user:left',
        'message',
      ]) {
        delete socket._callbacks[`$${key}`]
      }
      return await setValue(val => ({
        ...val,
        room: '',
        userListen: false,
        actionListen: false,
        ...options.state,
      }))
    }

    socket.destroy()
    socket = null
  }

  useEffect(() => {
    return () => {
      if (socket == null) return
      socket.emit('user:leave')
      reset({
        destroy: true,
        emit: '',
      })
    }
  }, [])

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

    socket.on('disconnect', () => {
      alert.error('lost connection to server')
    })

    socket.on('reconnect', async () => {
      if (socket.disconnected && !socket.connected) {
        socket.emit('restore', socket.token)
        alert.success('reconnected to server')
      }

      if (socket.disconnected) {
        return socket.connect()
      }
    })

    socket.reset = reset
  }, [cConfig.api])

  useEffect(() => {
    if (socket == null) return
    if (cUser == null || cUser.id == null) return
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

    const printMessage: (
      message: MaybeNull<{ name: string }>,
      type: 'joined' | 'left'
    ) => void = (message, type) => {
      if (
        !cUser ||
        !cUser.name ||
        !message ||
        !message.name ||
        message.name === cUser.name
      ) {
        return
      }
      alert.show(`${message.name} ${type}`)
    }

    socket.on('user:joined', message => printMessage(message, 'joined'))

    socket.on('user:left', message => printMessage(message, 'left'))

    socket.on('message', cChat.newMessage)

    setValue(state => ({ ...state, userListen: true }))
  }, [cUser, cUser.id, cAction.id, value.connected, value.userListen])

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
          await reset()
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
      if (value.connected === false || socket == null) {
        return
      }

      const { token } = cUser

      if (token) {
        if (value.userListen && value.userSet) return
        if (value.actionListen) return
        if (token === socket.token) return
        socket.token = token
        await socket.emit('user:join', token)
      } else if (value.userSet) {
        delete socket.token
        await socket.emit('user:leave')
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
