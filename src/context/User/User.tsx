import { User } from 'Api'
import CContext from 'CUser'

import React, { useState, useEffect } from 'react'

import { useAlert } from 'react-alert'

import Context from './context'
import * as api from '@/utils/api'

export const reset = () => ({
  id: '',
  token: '',
  name: '',
  group: undefined,
  ready: false,
  users: {},
})

export const UserProvider = props => {
  const alert = useAlert()
  const [value, setValue] = useState<CContext>({
    ...reset(),
    setValue: async (key, value) => {
      const changed: any = {}
      switch (key) {
        case 'token': {
          changed.group = (await api.user.group()) || undefined
          changed.token = value
          break
        }

        case 'group': {
          changed.group = value
          break
        }

        case 'jwt': {
          changed.name = value.name
          changed.id = value.id
          break
        }

        case 'reset': {
          await setValue(state => ({ ...state, ...reset() }))
          return localStorage.clear()
        }

        default:
          return
      }

      setValue(state => {
        if (
          changed.group &&
          Array.isArray(changed.group.users) &&
          changed.group.users.find(user => user.id === state.id) == null
        ) {
          changed.group = undefined
        }

        return { ...state, ...changed }
      })
    },
  })

  useEffect(() => {
    const initConfig = async () => {
      if (value.ready) return
      const ready = true
      const token: MaybeNull<string> = localStorage.getItem('token') || ''

      tokenValid: if (token) {
        const jwt = api.validate(token)
        if (!jwt || (await api.user.validToken(token)) == null) {
          alert.error('token not valid')
          localStorage.removeItem('token')
          break tokenValid
        }

        api.setToken(token)

        const group = (await api.user.group()) || undefined

        return setValue(state => ({
          ...state,
          ready,
          token,
          group,
          name: jwt.name,
          id: jwt.id,
        }))
      }

      return setValue(state => ({ ...state, ready }))
    }

    initConfig()
  }, [value.ready])

  useEffect(() => {
    const setValue = () => {
      if (!value.token) {
        localStorage.removeItem('token')
      } else {
        localStorage.setItem('token', value.token)
      }
    }
    setValue()
  }, [value.token])

  useEffect(() => {
    if (!value.group || !value.users) {
      return
    }

    const apply = async () => {
      if (!value.group || !value.group.users) {
        return
      }
      for (const user of value.group.users) {
        if (!user) {
          continue
        }
        const current = value.users[user.id]
        if (current != null) {
          continue
        }

        let fetched: MaybeNull<User['name']> = localStorage.getItem(user.id)
        if (!fetched) {
          const res = await api.list.get(user.id, 'user')
          if (!res) {
            continue
          }
          fetched = res.name
          localStorage.setItem(user.id, fetched)
        }

        value.users[user.id] = fetched
        setValue(state => ({ ...state, users: value.users }))
      }
    }
    apply()
  }, [value.group, value.users])

  return (
    <Context.Provider value={value}>
      {value == null || !value.ready ? null : props.children}
    </Context.Provider>
  )
}

export default UserProvider
