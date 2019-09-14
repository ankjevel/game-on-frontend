import CContext, { SetValue } from './Types'

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

  return (
    <Context.Provider value={value}>
      {value == null || !value.ready ? null : props.children}
    </Context.Provider>
  )
}

export default UserProvider
