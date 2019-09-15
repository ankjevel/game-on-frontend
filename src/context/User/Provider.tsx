import { User } from 'Api'
import CContext, { SetValue } from '../../types/CUser'

import React, { useState, useEffect } from 'react'
import Context from './context'
import * as api from '../../utils/api'

export const UserProvider = props => {
  const [value, setValue] = useState<CContext>({
    id: '',
    token: '',
    name: '',
    group: undefined,
    ready: false,
    users: {},
    setValue: async (key, value) => {
      const changed: any = {}
      switch (key) {
        case SetValue.Token: {
          changed.group = (await api.user.group()) || undefined
          changed.token = value
          break
        }

        case SetValue.Group: {
          changed.group = value
          break
        }

        case SetValue.JWT: {
          changed.name = value.name
          changed.id = value.id
          break
        }

        default:
          return
      }

      setValue(state => ({ ...state, ...changed }))
    },
  })

  useEffect(() => {
    const initConfig = async () => {
      const ready = true
      const token: MaybeNull<string> = localStorage.getItem('token') || ''

      tokenValid: if (token) {
        const jwt = api.validate(token)
        if (!jwt || (await api.user.validToken(token)) == null) {
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
  }, [])

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
    if (value.group == null) {
      return
    }

    const apply = async () => {
      for (const user of value.group.users) {
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
